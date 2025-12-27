export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) return res.status(200).json({ ok: false, error: "Missing BOT_TOKEN" });

  const WEBHOOK_URL = "https://richierich-telegram-game-server.vercel.app/api/webhook";

  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: WEBHOOK_URL }),
  });

  const data = await r.json();
  return res.status(200).json(data);
}
