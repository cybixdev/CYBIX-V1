const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.iplookup|\/iplookup)\s+([\s\S]+)/i, async (ctx) => {
    const ip = ctx.match[2].trim();
    try {
      const res = await axios.get(`http://ip-api.com/json/${ip}`);
      if (res.data && res.data.status === "success") {
        await sendBanner(ctx, `🌐 IP Lookup\n\nIP: ${ip}\nCountry: ${res.data.country}\nRegion: ${res.data.regionName}\nCity: ${res.data.city}\nISP: ${res.data.isp}\nLat/Lon: ${res.data.lat},${res.data.lon}\nTimezone: ${res.data.timezone}`);
      } else {
        await sendBanner(ctx, '🚫 IP lookup failed.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch IP info.');
    }
  });
};