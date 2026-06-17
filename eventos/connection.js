import { DisconnectReason } from "@adiwajshing/baileys";

export async function connectionHandler(update, sock, reconnectFn) {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const reason = lastDisconnect?.error?.output?.statusCode;
    console.log("Conexão encerrada. Tentando reconectar...");
    if (reason !== DisconnectReason.loggedOut) {
      setTimeout(reconnectFn, 3000);
    } else {
      console.error("Sessão desconectada. Re-autentique o bot.");
    }
  }
  if (connection === "open") {
    console.log("Bot conectado ao WhatsApp com sucesso.");
  }
}
