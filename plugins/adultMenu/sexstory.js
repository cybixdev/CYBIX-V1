const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('sexstory', async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/story');
      if (res.data && res.data.story) {
        await sendBanner(ctx, `📖 Sex Story\n\n${res.data.story}`);
      } else {
        await sendBanner(ctx, '🚫 No sex story found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch sex story.');
    }
  });
};