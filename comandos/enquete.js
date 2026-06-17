export async function handlePollCommand(body, chatId, sock) {
  const args = body.slice(body.indexOf(" ") + 1).split("|").map((item) => item.trim()).filter(Boolean);
  
  if (args.length < 2) {
    return sock.sendMessage(chatId, { text: "⚠️ *Uso correto:* /enquete Pergunta | Opção 1 | Opção 2" });
  }

  const question = args[0];
  const options = args.slice(1);

  try {
    await sock.sendMessage(chatId, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.warn("Não foi possível criar a enquete nativa.", error?.message || error);
    await sock.sendMessage(chatId, { text: "❌ Ocorreu um erro ao gerar a enquete." });
  }
}