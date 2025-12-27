export default async function handler(req, res) {
  try {
    // Telegram wysyła POST. GET/INNE odpowiadamy OK.
    if (req.method !== "POST") return res.status(200).send("OK");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(200).send("Missing BOT_TOKEN");

    const update = req.body;

    const api = async (method, payload) => {
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return r.json();
    };

    // Twoje stałe
    const GAME_SHORT_NAME = process.env.GAME_SHORT_NAME || "road2money";
    const GAME_URL = "https://richierich-road2money.vercel.app/";

    // 1) /start lub /play -> wysyłamy kartę gry (sendGame)
    if (update?.message?.chat?.id && typeof update?.message?.text === "string") {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text === "/start" || text === "/play") {
        await api("sendGame", {
          chat_id: chatId,
          game_short_name: GAME_SHORT_NAME,
        });
      }
    }

    // 2) Kliknięcie PLAY -> callback_query -> odpowiadamy URL-em gry
    if (update?.callback_query?.id) {
      const cq = update.callback_query;

      // Jeśli to inna gra niż nasza, i tak odpowiadamy, żeby Telegram nie wisiał
      if (cq.game_short_name === GAME_SHORT_NAME) {
        await api("answerCallbackQuery", {
          callback_query_id: cq.id,
          url: GAME_URL,
          cache_time: 0,
        });
      } else {
        await api("answerCallbackQuery", {
          callback_query_id: cq.id,
          cache_time: 0,
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    // Telegram musi dostać 200, żeby nie retry'ował
    return res.status(200).json({ ok: true });
  }
}
