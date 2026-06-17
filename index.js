import P from "pino";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { messagesHandler } from "./eventos/messages.js";
import { SESSION_FILE_PATH, RECONNECT_DELAY_MS } from "./config.js";

console.log("Iniciando Akira Bot...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authPath = join(__dirname, SESSION_FILE_PATH);

const logger = P({ level: "silent" });

let sock;
let reconnectTimer;

async function startBot() {
  console.log("Entrou no startBot()");

  try {
    console.log("Carregando autenticação...");
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    console.log("Autenticação carregada.");

    console.log("Buscando versão do Baileys...");
    const { version } = await fetchLatestBaileysVersion();
    console.log("Versão encontrada:", version);

    console.log("Criando socket...");
    sock = makeWASocket({
      logger,
      printQRInTerminal: true,
      auth: state,
      version,
    });
    console.log("Socket criado.");

    sock.ev.on("creds.update", () => {
      console.log("Credenciais atualizadas, salvando...");
      saveCreds();
    });

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {

    if (qr) {
        console.clear();
        console.log("📱 Escaneie este QR Code com o WhatsApp:\n");
        qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
        console.log("✅ Bot conectado!");
    }

    if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        console.log("Conexão encerrada:", statusCode);

        if (!loggedOut) {
            setTimeout(startBot, RECONNECT_DELAY_MS);
        } else {
            console.log("Sessão encerrada.");
        }
    }
});
    sock.ev.on("messages.upsert", async (upsert) => {
      try {
        console.log("messages.upsert recebido:", upsert.type);
        await messagesHandler(upsert, sock);
      } catch (error) {
        console.error("Erro no messagesHandler:", error);
      }
    });

    console.log("Listeners registrados.");
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    console.log(`Tentando iniciar novamente em ${RECONNECT_DELAY_MS}ms...`);
    reconnectTimer = setTimeout(() => {
      startBot().catch((err) => {
        console.error("Erro ao tentar iniciar novamente:", err);
      });
    }, RECONNECT_DELAY_MS);
  }
}

process.on("SIGINT", () => {
  console.log("Recebido SIGINT. Encerrando...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Recebido SIGTERM. Encerrando...");
  process.exit(0);
});

startBot().catch((err) => {
  console.error("Erro fatal ao chamar startBot():", err);
});