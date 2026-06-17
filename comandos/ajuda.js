import { getMenuMessage } from "../utils/menu.js";

export async function handleMenuCommand(chatId, sock) {
  const menu = getMenuMessage();
  await sock.sendMessage(chatId, { text: menu });
}
