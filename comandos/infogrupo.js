export async function handleGroupInfoCommand(chatId, sock, message) {
  try {
    const metadata = await sock.groupMetadata(chatId);
    
    // Contagem de administradores
    const admins = metadata.participants.filter(p => p.admin !== null);
    
    // Formatação da data de criação (convertendo timestamp para data legível)
    const dataCriacao = metadata.creation ? new Date(metadata.creation * 1000).toLocaleDateString('pt-BR') : "Desconhecida";
    
    // Tenta pegar o link de convite (se o bot for admin)
    let inviteCode = "Indisponível (bot não é admin)";
    try {
        inviteCode = await sock.groupInviteCode(chatId);
    } catch (e) {
        inviteCode = "Não foi possível obter";
    }

    const text = `ℹ️ *DETALHES DO GRUPO* ℹ️\n\n` +
                 `📛 *Nome:* ${metadata.subject}\n` +
                 `🆔 *ID do Grupo:* ${metadata.id}\n` +
                 `📅 *Criado em:* ${dataCriacao}\n` +
                 `👑 *Criador:* @${metadata.owner?.split('@')[0]}\n\n` +
                 `👥 *Total de membros:* ${metadata.participants.length}\n` +
                 `🛡️ *Total de ADMs:* ${admins.length}\n\n` +
                 `📝 *Descrição:* \n${metadata.desc || "Sem descrição"}\n\n` +
                 `🔗 *Link de convite:* https://chat.whatsapp.com/${inviteCode}\n\n` +
                 `_Mantenha o grupo sempre organizado!_`;

    await sock.sendMessage(chatId, { 
        text, 
        mentions: [metadata.owner],
        contextInfo: { 
            mentionedJid: [metadata.owner] 
        }
    }, { quoted: message });

  } catch (error) {
    console.error(error);
    await sock.sendMessage(chatId, { text: "❌ Não consegui obter todos os dados do grupo. Verifique se sou administrador." });
  }
}