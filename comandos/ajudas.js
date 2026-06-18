export async function handleAjudasCommand(chatId, sock, message) {
  const menuTexto = `❖ ── ✦ ── ❖ ── ✦ ── ❖ ── ✦
      💮 𝐀 𝐊 𝐈 𝐑 𝐀   𝐁 𝐎 𝐓 💮      
❖ ── ✦ ── ❖ ── ✦ ── ❖ ── ✦
╭━━━━━━━ ⋆⋅☆⋅⋆ ━━━━━━━╮
      𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒             
╰━━━━━━━ ⋆⋅☆⋅⋆ ━━━━━━━╯

Aqui tens a lista de tudo o que eu posso fazer por ti! Dá uma olhada: 🥰

━━━━━━ 𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀𝐑 ━━━━━━
➻ 📅 */evento DD/MM HH:MM <texto>* — Cria um evento super organizado no grupo 📝
➻ ⏰ */lembrete DD/MM HH:MM <texto>* — Guarda um lembrete para não te esqueceres ⏰
➻ 📋 */lista* — Mostra todos os eventos que temos agendados 📋
➻ ❌ */cancelar <ID>* — Apaga um evento usando o ID dele rápido ❌
➻ ℹ️ */infogrupo* — Mostra todos os detalhes e o link do grupo ℹ️

━━━━━━ 𝐈𝐍𝐓𝐄𝐑𝐀𝐂̧𝐀̃𝐎 ━━━━━━
➻ 📞 */call <aviso>* — Faz uma chamada geral e marca toda a gente 🚨
➻ 📊 */enquete <pergunta> | <opções>* — Cria uma votação bem legal para o grupo 📊
➻ ❓ */ajuda* ou */menu* — Mostra esta listinha linda de comandos 🌸
➻ 🗺️ */cep <número>* — Procura uma morada num piscar de olhos 📍

✦ • ── • ── • ── • ── • ── • ── • ✦
    💡 ⦅ 𝙐𝙨𝙚 𝙣𝙤 𝙋𝙑 𝙤𝙪 𝙚𝙢 𝙂𝙧𝙪𝙥𝙤𝙨 ⦆
    _Espero ajudar! Qualquer coisa chama_ 💕
✦ • ── • ── • ── • ── • ── • ── • ✦`;

  await sock.sendMessage(chatId, { text: menuTexto }, { quoted: message });
}