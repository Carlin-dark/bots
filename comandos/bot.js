export async function handleBotCommand(chatId, sock) {
  const infoMensagem = 
`🤖 *INFORMAÇÕES DO AKIRA BOT* 🤖
──────────────────────────
✨ *Status:* v1.1.0 (Online)
👑 *Dono/Criador:* Carlos
🔱 * Número:* +55 86 74001176
🔱 * Contato:* https://wa.me/558674001176
💻 *Plataforma:* Termux / Node.js
📖 *Linguagem:* JavaScript

──────────────────────────
🔗 *Repositório Privado (GitHub):*
https://github.com/Carlin-dark/bots

_Apenas o criador e administradores autorizados têm acesso ao código-fonte deste reino._`;

  try {
    await sock.sendMessage(chatId, { text: infoMensagem });
  } catch (error) {
    console.warn("Não foi possível enviar as informações do bot.", error?.message || error);
  }
}