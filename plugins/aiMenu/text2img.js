const axios = require('axios');

module.exports = function(bot, config) {
  bot.command('text2img', async ctx => {
    try {
      const prompt = ctx.message.text.split(' ').slice(1).join(' ');
      const url = `https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=${encodeURIComponent(prompt)}`;
      const res = await axios.get(url);
      const imgUrl = res.data.url || res.data.result || "No image found";
      await ctx.replyWithPhoto(
        imgUrl,
        {
          caption: `🖼️ Text2Img:\nPrompt: ${prompt}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
              ]
            ]
          }
        }
      );
    } catch (e) {
      await ctx.reply('Failed to fetch Text2Img result.');
    }
  });
};