const axios = require('axios');
module.exports = {
  command: 'yts',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .yts <movie name>');
    try {
      const res = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(query)}`);
      const movies = res.data.data.movies;
      if (movies && movies.length) {
        await sendBanner(ctx, `*YTS Search:*\n${movies.map(m => `${m.title} (${m.year})\n${m.url}`).join('\n\n')}`);
      } else {
        await sendBanner(ctx, 'No results found.');
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to search movies.');
    }
  }
};