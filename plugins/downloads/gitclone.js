const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.gitclone (.+)/i,
  async handler(ctx) {
    const repoUrl = ctx.match[1];
    const url = `https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(repoUrl)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.clone_url) {
      await ctx.replyWithPhoto(
        { url: banner },
        {
          caption: `🗃️ Repo: ${res.data.result.clone_url}`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ Unable to clone repo.');
    }
  }
};