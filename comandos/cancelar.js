import { readJson, writeJson } from "../utils/functions.js";
import { DATABASE } from "../config.js";

export async function handleCancelCommand(body, chatId, sock) {
  const args = body.split(" ").slice(1);
  const id = Number(args[0]);

  if (!id || isNaN(id)) {
    return sock.sendMessage(chatId, { text: "⚠️ *Uso correto:* /cancelar <ID numérico>" });
  }

  const events = await readJson(DATABASE.events);
  const index = events.findIndex((item) => item.id === id);
  
  if (index === -1) {
    return sock.sendMessage(chatId, { text: `❌ Evento com ID *${id}* não foi encontrado.` });
  }

  const [canceledEvent] = events.splice(index, 1);
  await writeJson(DATABASE.events, events);

  await sock.sendMessage(chatId, { text: `✅ *Evento Cancelado!*\n\nID: ${id}\nDescrição: ${canceledEvent.description}` });
}