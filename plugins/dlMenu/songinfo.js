const axios = require("axios");
module.exports = {
    run: async (ctx) => {
        const query = ctx.message.text.split(" ").slice(1).join(" ");
        if (!query) return ctx.reply("❌ Please provide a song name.");
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1`;
            const res = await axios.get(url);
            const song = res.data.results[0];
            if (!song) return ctx.reply("❌ No song found.");
            await ctx.reply(
                `🎵 *${song.trackName}*\n👤 Artist: ${song.artistName}\n💽 Album: ${song.collectionName}\n🔗 [Preview](${song.previewUrl})`,
                { parse_mode: "Markdown" }
            );
        } catch (err) {
            console.error(err);
            ctx.reply("❌ Error fetching song info.");
        }
    }
};