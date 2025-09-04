const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.anime|\/anime)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.jikan.moe/v4/random/anime');
      if (res.data && res.data.data) {
        const anime = res.data.data;
        await sendBanner(ctx, `🌸 Anime\n\nTitle: ${anime.title}\nType: ${anime.type}\nEpisodes: ${anime.episodes}\nSynopsis: ${anime.synopsis}`);
      } else {
        await sendBanner(ctx, '🚫 No anime found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch anime.');
    }
  });
};