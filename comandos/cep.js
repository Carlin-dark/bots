export async function handleCepCommand(body, chatId, sock, message) {
  // Pega o que o usuário digitou depois do comando
  const args = body.split(" ");
  
  if (args.length < 2) {
    return sock.sendMessage(chatId, { text: "⚠️ *Como usar:* Digite /cep seguido do número. Ex: /cep 01001000" }, { quoted: message });
  }

  // Limpa qualquer traço e deixa só os números
  const cep = args[1].replace(/\D/g, '');
  
  if (cep.length !== 8) {
    return sock.sendMessage(chatId, { text: "⚠️ O CEP precisa ter exatamente 8 números." }, { quoted: message });
  }

  try {
    // Busca os dados no site ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return sock.sendMessage(chatId, { text: "❌ Poxa, não encontrei esse CEP!" }, { quoted: message });
    }

    const textoCep = `📍 *CONSULTA DE CEP* 📍\n\n` +
                 `*CEP:* ${data.cep}\n` +
                 `*Rua:* ${data.logradouro}\n` +
                 `*Bairro:* ${data.bairro}\n` +
                 `*Cidade:* ${data.localidade} - ${data.uf}\n` +
                 `*Estado:* ${data.estado}\n` +
                 `*Região:* ${data.regiao}\n` +
                 `*DDD:* (${data.ddd})`;
    
    await sock.sendMessage(chatId, { text: textoCep }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(chatId, { text: "❌ Deu um erro na minha conexão ao buscar o CEP." }, { quoted: message });
  }
}