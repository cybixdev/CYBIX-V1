const axios = require('axios');

exports.run = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  if (!args) return sock.sendMessage(from, { text: 'Please provide a prompt for ChatGPT.' });
  try {
    const res = await axios.post('https://chat.cybix.tech/api/chat', { prompt: args });
    if (res.data && res.data.response) {
      await sock.sendMessage(from, { text: res.data.response });
    } else {
      await sock.sendMessage(from, { text: "No response from AI." });
    }
  } catch (e) {
    await sock.sendMessage(from, { text: "Error: " + e.message });
  }
};