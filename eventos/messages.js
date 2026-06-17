import { COMMAND_PREFIX } from "../config.js";
import { handleEventCommand } from "../comandos/evento.js";
import { handleListCommand } from "../comandos/lista.js";
import { handleCancelCommand } from "../comandos/cancelar.js";
import { handleReminderCommand } from "../comandos/lembrete.js";
import { handleCallCommand } from "../comandos/call.js";
import { handlePollCommand } from "../comandos/enquete.js";
import { handleMenuCommand } from "../comandos/ajuda.js";

export async function messagesHandler(upsert, sock) {
  try {
    const messages = upsert.messages;
    if (!messages || messages.length === 0) return;

    const message = messages[0];
    if (!message.message || message.key.fromMe) return;

    const text = message.message.conversation || message.message.extendedTextMessage?.text || "";
    const chatId = message.key.remoteJid;

    // 1. Identificar se o rementente é o Dono (usando o seu número)
    const senderJid = message.key.participant || message.key.remoteJid || "";
    const isOwner = senderJid.includes("192565412392992");

    // 2. Se for o dono enviando QUALQUER mensagem, o bot reage com uma coroa
    if (isOwner) {
      try {
        await sock.sendMessage(chatId, { react: { text: "👑", key: message.key } });
      } catch (e) {
        console.warn("Não foi possível reagir à mensagem do dono.");
      }
    }

    // Ignora mensagens que não começam com o prefixo do bot
    if (!text.startsWith(COMMAND_PREFIX)) return;

    // 3. Se for o dono e a mensagem for um COMANDO, ele manda a frase especial citando você
    if (isOwner) {
      await sock.sendMessage(chatId, { text: "É pra já, meu mestre! 🙇‍♂️" }, { quoted: message });
    }

    const body = text.trim();
    const command = body.split(" ")[0].slice(1).toLowerCase();

    switch (command) {
      case "menu":
      case "ajuda":
        await handleMenuCommand(chatId, sock);
        break;
      case "evento":
        await handleEventCommand(body, chatId, sock);
        break;
      case "lista":
        await handleListCommand(chatId, sock);
        break;
      case "cancelar":
        await handleCancelCommand(body, chatId, sock);
        break;
      case "lembrete":
        await handleReminderCommand(body, chatId, sock);
        break;
      case "call":
        await handleCallCommand(body, message, chatId, sock);
        break;
      case "enquete":
        await handlePollCommand(body, chatId, sock);
        break;
      default:
        await sock.sendMessage(chatId, { text: "Comando não reconhecido. Use /ajuda para ver os comandos disponíveis." });
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
}