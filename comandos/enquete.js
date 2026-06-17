import { buildPoll } from "../utils/functions.js";

export async function handlePollCommand(body, chatId, sock) {
  const args = body.slice(body.indexOf(" ") + 1).split("|").map((item) => item.trim()).filter(Boolean);
  if (args.length < 2) {
    return sock.sendMessage(chatId, { text: "Uso correto: /enquete Pergunta | Opção 1 | Opção 2 ..." });
  }

  const question = args[0];
  const options = args.slice(1);
  const poll = buildPoll(question, options);

  await sock.sendMessage(chatId, { text: poll.text });
  if (poll.reactions.length > 0) {
    try {
      await sock.sendMessage(chatId, {
        react: {
          text: poll.reactions[0],
          key: { remoteJid: chatId }
        }
      });
    } catch (error) {
      console.warn("Não foi possível reagir automaticamente à enquete.", error?.message || error);
    }
  }
}
