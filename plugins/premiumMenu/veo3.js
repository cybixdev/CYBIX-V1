const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "veo3",
  aliases: [],
  premium: true,
  run: async (bot, msg, argText) => {
    if (!argText) {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Send your prompt: `.veo3 [prompt]`",
        reply_markup: getChannelButtons(),
      });
      return;
    }
    try {
      // HuggingFace public space (Veo-3) as a prompt-to-video API
      const res = await axios.post("https://danieloden-veo-3.hf.space/api/predict", {
        data: [argText, 10, 0.5, "veo-3"],
      });
      const result = res.data?.data?.[0];
      if (result && result.startsWith("http")) {
        await bot.sendVideo(msg.chat.id, result, {
          caption: "🎬 Veo3 video generated.",
          reply_markup: getChannelButtons(),
        });
      } else {
        await bot.sendPhoto(msg.chat.id, getBanner(), {
          caption: "❌ Failed to generate video.",
          reply_markup: getChannelButtons(),
        });
      }
    } catch {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Video generation error (try again).",
        reply_markup: getChannelButtons(),
      });
    }
  }
};