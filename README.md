# Akira Bot

Bot de WhatsApp criado com Node.js e Baileys.

## Instalação

1. Abra o terminal na pasta do projeto.
2. Execute:

```bash
npm install
```

## Primeiro uso

1. Execute o bot:

```bash
npm start
```

2. Escaneie o QR code exibido no terminal usando o WhatsApp no celular.

## Comandos suportados

- `/menu` ou `/ajuda` - mostra o menu principal
- `/evento DD/MM HH:MM Descrição` - cria um evento
- `/lista` - lista eventos agendados
- `/cancelar ID` - remove um evento pelo ID
- `/lembrete DD/MM HH:MM Mensagem` - agenda um lembrete
- `/call Mensagem` - envia aviso de call com o nome do usuário
- `/enquete Pergunta | Opção 1 | Opção 2 ...` - cria enquete

## Observações

- Os eventos e lembretes são salvos em JSON para persistência.
- O bot reconecta automaticamente quando o WhatsApp desconecta.
- Compatível com Node.js LTS, Windows, Linux e Termux.
