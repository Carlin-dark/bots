import { readJson, writeJson, parseDateTime } from "../utils/functions.js";
import { DATABASE } from "../config.js";

export async function handleReminderCommand(body, chatId, sock) {
  const args = body.split(" ").slice(1);
  if (args.length < 3) {
    return sock.sendMessage(chatId, { text: "Uso correto: /lembrete DD/MM HH:MM Mensagem" });
  }

  const [dateText, timeText, ...rest] = args;
  const message = rest.join(" ").trim();
  const dateTime = parseDateTime(dateText, timeText);

  if (!dateTime || message.length === 0) {
    return sock.sendMessage(chatId, { text: "Formato inválido. Use: /lembrete DD/MM HH:MM Mensagem" });
  }

  const reminders = await readJson(DATABASE.reminders);
  const reminder = {
    id: reminders.length + 1,
    chatId,
    timestamp: dateTime.toISOString(),
    message,
    sent: false
  };

  reminders.push(reminder);
  await writeJson(DATABASE.reminders, reminders);

  await sock.sendMessage(chatId, {
    text: `✅ Lembrete agendado!\n\n📅 Data: ${dateText}\n🕗 Hora: ${timeText}\n${message}`
  });
}
