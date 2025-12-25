export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("OK");
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      return res.status(500).send("Missing TELEGRAM_BOT_TOKEN");
    }

    const update = req.body;

    const api = async (method, payload) => {
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return r.json();
    };

    const GAME_SHORT_NAME = "road2money";
    const GAME_URL = "https://richierich-road2money.vercel.app/";

    // 1) /start -> wyślij grę (sendGame)
    if (update.message && update.message.chat && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text === "/start" || text === "/play") {
        await api("sendGame", {
          chat_id: chatId,
          game_short_name: GAME_SHORT_NAME,
        });
      }
    }

    // 2) Kliknięcie PLAY -> callback_query -> MUSISZ odpowiedzieć URL-em gry
    if (update.callback_query && update.callback_query.id) {
      const cq = update.callback_query;

      // Telegram wysyła game_short_name przy grach
      if (cq.game_short_name === GAME_SHORT_NAME) {
        await api("answerCallbackQuery", {
          callback_query_id: cq.id,
          url: GAME_URL,
        });
      } else {
        // żeby Telegram nie “wisiał”
        await api("answerCallbackQuery", {
          callback_query_id: cq.id,
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: true }); // Telegram i tak musi dostać 200
  }
}
