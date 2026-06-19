import { DisconnectReason } from "@whiskeysockets/baileys";

export async function handleConnectionUpdate(update, startBot) {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log("QR Code gerado! Escaneie no WhatsApp.");
  }

  if (connection === "close") {
    const statusCode = lastDisconnect?.error?.output?.statusCode;
    
    // Tratativa específica para o erro 440
    if (statusCode === DisconnectReason.connectionReplaced) {
      console.log("⚠️ Conexão substituída! Feche outras instâncias ou remova o aparelho no WhatsApp.");
      return; // Interrompe a tentativa de reconexão automática neste caso
    }

    // Tratativa para sessão deslogada
    if (statusCode === DisconnectReason.loggedOut) {
      console.log("❌ Sessão encerrada. Delete a pasta 'auth_info' e gere um novo QR.");
      return;
    }

    // Para outros erros (como queda de rede), tenta reconectar após 5 segundos
    console.log("🔄 Tentando reconectar em 5 segundos...");
    setTimeout(startBot, 5000);
    
  } else if (connection === "open") {
    console.log("✅ Akira Bot online!");
  }
}