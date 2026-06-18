import { COMMAND_PREFIX } from "../config.js";
import { handleCepCommand } from "../comandos/cep.js";
import { handleGroupInfoCommand } from "../comandos/infogrupo.js";
import { handleEventCommand } from "../comandos/evento.js";
import { handleListCommand } from "../comandos/lista.js";
import { handleCancelCommand } from "../comandos/cancelar.js";
import { handleReminderCommand } from "../comandos/lembrete.js";
import { handleCallCommand } from "../comandos/call.js";
import { handlePollCommand } from "../comandos/enquete.js";
import { handleMenuCommand } from "../comandos/ajuda.js";
import { handleAjudasCommand } from "../comandos/ajudas.js";

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

    // 2. Reações nas mensagens (Dono x Membros)
    if (isOwner) {
      // Se for o dono, reage com a coroa
      try {
        await sock.sendMessage(chatId, { react: { text: "👑", key: message.key } });
      } catch (e) {
        console.warn("Não foi possível reagir à mensagem do dono.");
      }
    } else {
      // Se NÃO for o dono, reage com o emoji 🥵
      try {
        await sock.sendMessage(chatId, { react: { text: "🥵", key: message.key } });
      } catch (e) {
        console.warn("Não foi possível reagir à mensagem do membro.");
      }
    }

    // Ignora mensagens que não começam com o prefixo do bot
    if (!text.startsWith(COMMAND_PREFIX)) return;

    // 3. Respostas aos comandos (Dono x Membros)
    if (isOwner) {
      await sock.sendMessage(chatId, { text: "É pra já, meu mestre! 🙇‍♂️" }, { quoted: message });
    } else {
      // Lista de mensagens aleatórias para os outros membros
      const frasesAleatorias = [
  "Tudo certinho! Já estou processando seu pedido",
  "Puxa, mais trabalho? Brincadeira, já tô fazendo!",
  "Anotadíssimo! Executando em 3, 2, 1...",
  "Pode deixar, recebi seu comando alto e claro!",
  "Só um minutinho que eu já resolvo isso pra você",
  "Prontinho, já coloquei na minha lista de tarefas",
  "Deixa comigo! Trabalhando nisso agora mesmo",
  "Bora lá! Processando o que você pediu...",
  "Comando recebido! Já estou com a mão nos códigos",
  "Tudo bem, pedido recebido com sucesso!"
    ];
      
      // Sorteia uma frase da lista acima
      const fraseEscolhida = frasesAleatorias[Math.floor(Math.random() * frasesAleatorias.length)];
      
      await sock.sendMessage(chatId, { text: fraseEscolhida }, { quoted: message });
    }

    const body = text.trim();
    const command = body.split(" ")[0].slice(1).toLowerCase();

    switch (command) {
      case "menu":
      case "ajuda":
        await handleMenuCommand(chatId, sock);
        break;
        case "ajudas":
        await handleAjudasCommand(chatId, sock, message);
        break;
        case "cep":
        await handleCepCommand(body, chatId, sock, message);
        break;
      case "infogrupo":
        await handleGroupInfoCommand(chatId, sock, message);
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