const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('imggen', async ctx => {
    const prompt = ctx.message.text.replace('/imggen', '').trim();
    if (!prompt) return ctx.reply('Usage: /imggen <your image description>');
    try {
      const res = await fetch('https://stablediffusionweb.com/api/v3/text2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, negative_prompt: "", width: "512", height: "512", samples: "1", num_inference_steps: "21" })
      });
      const json = await res.json();
      if (json?.output?.[0]) {
        ctx.replyWithPhoto(json.output[0]);
      } else {
        ctx.reply('No image generated.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};