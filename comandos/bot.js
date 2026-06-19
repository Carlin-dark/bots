export async function handleBotCommand(chatId, sock) {
  const infoMensagem = 
`🤖 *INFORMAÇÕES DO AKIRA BOT* 🤖
──────────────────────────
✨ *Status:* v1.1.0 (Online)
👑 *Dono/Criador:* Carlin-dark
💻 *Plataforma:* Termux / Node.js
📖 *Linguagem:* JavaScript

⚙️ _Bot otimizado com correções automáticas de conexão e autenticação via QR Code estável._
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