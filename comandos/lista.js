import { readJson, buildEventList } from "../utils/functions.js";
import { DATABASE } from "../config.js";

export async function handleListCommand(chatId, sock) {
  const events = await readJson(DATABASE.events);
  const message = buildEventList(events);
  await sock.sendMessage(chatId, { text: message });
}
