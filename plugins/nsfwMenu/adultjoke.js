const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.adultjoke|\/adultjoke)$/i, async (ctx) => {
    try {
      // JokeAPI (public, safe for NSFW jokes with 'Dark' category)
      const res = await axios.get('https://v2.jokeapi.dev/joke/Dark?type=single');
      if (res.data && res.data.joke) {
        await sendBanner(ctx, `😏 Adult Joke\n\n${res.data.joke}`);
      } else {
        await sendBanner(ctx, '🚫 No adult joke found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch adult joke.');
    }
  });
};