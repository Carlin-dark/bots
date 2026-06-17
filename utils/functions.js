import { promises as fs } from "fs";
import { REMINDER_CHECK_INTERVAL_MS, DATABASE } from "../config.js";

export async function readJson(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "[]", "utf8");
      return [];
    }
    console.error(`Erro ao ler JSON:`, error);
    return [];
  }
}

export async function writeJson(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, json, "utf8");
  } catch (error) {
    console.error(`Erro ao escrever JSON:`, error);
  }
}

export async function getNextId(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id || 0)) + 1;
}

export function parseDateTime(dateText, timeText) {
  const [day, month] = dateText.split("/").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  if (!day || !month || isNaN(hour) || isNaN(minute)) return null;
  return new Date(new Date().getFullYear(), month - 1, day, hour, minute, 0, 0);
}

export function formatEvent(event) {
  return `📌 *ID:* ${event.id}\n📅 *Data:* ${event.date}\n🕗 *Hora:* ${event.time}\n💬 *Descrição:* ${event.description}`;
}

export function buildEventList(events) {
  if (events.length === 0) return "📋 *Nenhum evento agendado no momento.*";
  
  const header = "📋 *EVENTOS AGENDADOS*\n\n";
  const eventLines = events.map((event) => `[ID: *${event.id}*]\n📅 ${event.date} às 🕗 ${event.time}\n💬 ${event.description}`);
  
  return header + eventLines.join("\n\n〰️〰️〰️〰️〰️〰️〰️〰️〰️\n\n");
}

export function extractSenderName(message) {
  const id = message?.key?.participant || message?.key?.remoteJid || "";
  return id.split("@")[0] || "Usuário";
}

export async function startReminderWatcher(sock) {
  setInterval(async () => {
    try {
      const reminders = await readJson(DATABASE.reminders);
      const now = new Date();
      let hasChanges = false;

      const pending = reminders.filter((reminder) => !reminder.sent && new Date(reminder.timestamp) <= now);
      
      if (pending.length > 0) {
        for (const reminder of pending) {
          await sock.sendMessage(reminder.chatId, { text: `⏰ *LEMBRETE*\n\n${reminder.message}` });
          reminder.sent = true;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        await writeJson(DATABASE.reminders, reminders);
      }
    } catch (error) {
      console.error("Erro no watcher de lembretes:", error);
    }
  }, REMINDER_CHECK_INTERVAL_MS || 30000);
}