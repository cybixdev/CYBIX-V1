const axios = require('axios');

exports.run = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  if (!args) return sock.sendMessage(from, { text: 'Usage: .openai <prompt>' });
  try {
    const res = await axios.post('https://chat.cybix.tech/api/chat', { prompt: args });
    await sock.sendMessage(from, { text: res.data.response || "No response from AI." });
  } catch (e) {
    await sock.sendMessage(from, { text: "Error: " + e.message });
  }
};