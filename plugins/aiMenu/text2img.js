const axios = require('axios');
module.exports = {
  command: 'text2img',
  handler: async (ctx, sendBanner) => {
    let prompt = ctx.message.text.split(' ').slice(1).join(' ') || "A Cute Baby";
    try {
      const res = await axios.get(`https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=${encodeURIComponent(prompt)}`);
      if (res.data.url) {
        await ctx.replyWithPhoto(res.data.url, {
          caption: `*Text2Img:*\nPrompt: ${prompt}`,
          ...require('../../index').buttons,
          parse_mode: 'Markdown'
        });
      } else {
        await sendBanner(ctx, `*Text2Img:*\n${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      await sendBanner(ctx, `Failed to generate image.`);
    }
  }
};