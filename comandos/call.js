import { extractSenderName } from "../utils/functions.js";

export async function handleCallCommand(body, message, chatId, sock) {
  const args = body.split(" ").slice(1);
  const callMessage = args.join(" ").trim();

  if (callMessage.length === 0) {
    return sock.sendMessage(chatId, { text: "⚠️ *Uso correto:* /call <Sua Mensagem>" });
  }

  const senderJid = message.key.participant || message.key.remoteJid || "";
  const senderName = extractSenderName(message);
  
  const isOwner = senderJid.includes("192565412392992");

  const roleText = isOwner 
    ? `👑 *DONO DO BOT: Carlos*\n- ID: ${senderName}` 
    : `👤 *Membro:* ${senderName}`;

  if (isOwner) {
    try {
      await sock.sendMessage(chatId, { react: { text: "👑", key: message.key } });
    } catch (e) {
      console.warn("Não foi possível reagir à mensagem do dono.");
    }
  }

  // 5. Lógica para extrair todos os membros do grupo e criar a lista de menções
  let groupMentions = [];
  let mentionText = "";

  if (chatId.endsWith("@g.us")) {
    try {
      const groupMetadata = await sock.groupMetadata(chatId);
      // Pega todos os participantes
      const participants = groupMetadata.participants;
      
      // Cria o texto com @ para cada usuário e popula o array de menções
      groupMentions = participants.map((p) => p.id);
      mentionText = participants.map((p) => `@${p.id.split("@")[0]}`).join(" ");
    } catch (error) {
      console.error("Erro ao carregar os dados do grupo para menção:", error);
    }
  }

  // 4. Montar a nova mensagem chamativa com as marcações
  const textMessage = `🚨 *CHAMADA GERAL* 🚨\n\n${roleText}\n\n📢 *Aviso:* ${callMessage}\n\n${mentionText}\n\n_🔔 Todos os membros foram marcados._`;

  // 6. Enviar a mensagem passando a array de menções
  await sock.sendMessage(chatId, {
    text: textMessage,
    mentions: groupMentions
  });
}