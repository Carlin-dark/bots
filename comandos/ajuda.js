// O import agora aponta corretamente para o arquivo ajuda.js dentro da pasta utils
import { getMenuMessage } from "../utils/ajuda.js";

export async function handleMenuCommand(chatId, sock) {
  const menu = getMenuMessage();
  await sock.sendMessage(chatId, { text: menu });
}