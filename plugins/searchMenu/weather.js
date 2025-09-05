const axios = require('axios');
module.exports = {
  command: 'weather',
  handler: async (ctx, sendBanner) => {
    const city = ctx.message.text.split(' ').slice(1).join(' ');
    if (!city) return sendBanner(ctx, 'Usage: .weather <city>');
    try {
      // Using OpenWeatherMap API (you need your API key)
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=YOUR_OPENWEATHER_API_KEY`);
      const w = res.data;
      await sendBanner(ctx, `*Weather for ${city}:*\n${w.weather[0].description}\nTemp: ${w.main.temp}°C\nHumidity: ${w.main.humidity}%`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch weather.');
    }
  }
};