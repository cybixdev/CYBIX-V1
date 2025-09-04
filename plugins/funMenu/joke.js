const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.joke|\/joke)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
      let joke = res.data.type === "single" ? res.data.joke : `${res.data.setup}\n${res.data.delivery}`;
      if (joke) {
        await sendBanner(ctx, `😂 Joke\n\n${joke}`);
      } else {
        await sendBanner(ctx, '🚫 No joke found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch joke.');
    }
  });
};