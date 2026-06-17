import { extractSenderName } from "../utils/functions.js";

export async function handleCallCommand(body, message, chatId, sock) {
  const args = body.split(" ").slice(1);
  const callMessage = args.join(" ").trim();

  if (callMessage.length === 0) {
    return sock.sendMessage(chatId, { text: "Uso correto: /call Mensagem" });
  }

  const sender = extractSenderName(message);
  await sock.sendMessage(chatId, {
    text: `📞 ${sender} iniciou uma ligação!\n\n💬 ${callMessage}`
  });
}
