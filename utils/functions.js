import { promises as fs } from "fs";
import { join } from "path";
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
    throw error;
  }
}

export async function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf8");
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
  return `ID: ${event.id}\n\n📅 Data: ${event.date}\n🕗 Hora: ${event.time}\n${event.description}`;
}

export function buildMenu() {
  return `❖ ── ✦ ── ❖ ── ✦ ── ❖ ── ✦ ── ❖
      💮 𝐀 𝐊 𝐈 𝐑 𝐀   𝐁 𝐎 𝐓 💮      
❖ ── ✦ ── ❖ ── ✦ ── ❖ ── ✦ ── ❖
╭━━━━━━━━━━ ⋆⋅☆⋅⋆ ━━━━━━━━━━╮
          𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒             
╰━━━━━━━━━━ ⋆⋅☆⋅⋆ ━━━━━━━━━━╯

━━━━━━━━━ 𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀𝐑 ━━━━━━━━━
➻ 📅 /evento
➻ ⏰ /lembrete
➻ 📋 /lista
➻ ❌ /cancelar

━━━━━━━━━ 𝐈𝐍𝐓𝐄𝐑𝐀𝐂̧𝐀̃𝐎 ━━━━━━━━━
➻ 📞 /call
➻ 📊 /enquete
➻ ❓ /ajuda

✦ • ── • ── • ── • ── • ── • ── • ✦
    💡 ⦅ 𝙐𝙨𝙚 𝙣o 𝙋𝙑 𝙤𝙪 𝙚𝙢 𝙂𝙧𝙪𝙥os ⦆
✦ • ── • ── • ── • ── • ── • ── • ✦`;
}

export function buildEventList(events) {
  if (events.length === 0) return "📋 Nenhum evento agendado.";
  return ["📋 Eventos agendados", ""].concat(
    events.map((event) => `[{event.id}]\n${event.description}\n📅 ${event.date}\n🕗 ${event.time}`)
  ).join("\n\n");
}

export function buildPoll(question, options) {
  const lines = ["📊 Enquete", "", question, ""];
  const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
  options.forEach((option, index) => {
    lines.push(`${reactions[index]} ${option.trim()}`);
  });
  return { text: lines.join("\n"), reactions: reactions.slice(0, options.length) };
}

export function extractSenderName(message) {
  const id = message.key.participant || message.key.remoteJid || "";
  return id.split("@")[0];
}

export async function startReminderWatcher(sock) {
  const reminders = await readJson(DATABASE.reminders);
  setInterval(async () => {
    try {
      const now = new Date();
      const pending = reminders.filter((reminder) => !reminder.sent && new Date(reminder.timestamp) <= now);
      if (pending.length > 0) {
        for (const reminder of pending) {
          await sock.sendMessage(reminder.chatId, { text: `⏰ Lembrete\n\n${reminder.message}` });
          reminder.sent = true;
        }
        await writeJson(DATABASE.reminders, reminders);
      }
    } catch (error) {
      console.error("Erro no watcher de lembretes:", error);
    }
  }, REMINDER_CHECK_INTERVAL_MS);
}
