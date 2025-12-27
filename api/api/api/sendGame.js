export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const GAME_SHORT_NAME = process.env.GAME_SHORT_NAME || "road2money";

  if (!BOT_TOKEN)
    return res.status(200).json({ ok: false, error: "Missing BOT_TOKEN" });

  const chat_id = req.query.chat_id;
  if (!chat_id)
    return res.status(200).json({ ok: false, error: "add ?chat_id=..." });

  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendGame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, game_short_name: GAME_SHORT_NAME }),
  });

  const data = await r.json();
  return res.status(200).json(data);
}
