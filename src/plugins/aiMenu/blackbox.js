exports.run = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  if (!args) return sock.sendMessage(from, { text: 'Usage: .blackbox <code>' });
  // This is a stub; you can integrate with Blackbox AI API if you have access
  await sock.sendMessage(from, { text: `Blackbox AI (stub):\n${args}` });
};