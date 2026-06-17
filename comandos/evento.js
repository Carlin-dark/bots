import { readJson, writeJson, getNextId, parseDateTime, formatEvent } from "../utils/functions.js";
import { DATABASE } from "../config.js";

export async function handleEventCommand(body, chatId, sock) {
  const args = body.split(" ").slice(1);
  if (args.length < 3) {
    return sock.sendMessage(chatId, { text: "Uso correto: /evento DD/MM HH:MM Descrição do evento" });
  }

  const [dateText, timeText, ...rest] = args;
  const description = rest.join(" ").trim();
  const dateTime = parseDateTime(dateText, timeText);

  if (!dateTime || description.length === 0) {
    return sock.sendMessage(chatId, { text: "Formato inválido. Use: /evento DD/MM HH:MM Descrição do evento" });
  }

  const events = await readJson(DATABASE.events);
  const id = await getNextId(events);
  const event = { id, date: dateText, time: timeText, description, createdAt: new Date().toISOString() };

  events.push(event);
  await writeJson(DATABASE.events, events);

  await sock.sendMessage(chatId, {
    text: `✅ Evento criado!\n\nID: ${id}\n\n📅 Data: ${dateText}\n🕗 Hora: ${timeText}\n${description}`
  });
}
