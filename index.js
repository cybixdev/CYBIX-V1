const fs = require("fs-extra");
const P = require("pino");
const readline = require("readline");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const { handleCommand } = require("./handlers/commandHandler");
const { loadSettings } = require("./settings");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "fatal" }),
    printQRInTerminal: true
  });
  
  const settings = loadSettings();
  let ownerRaw = settings.ownerNumber?.[0] || "263784262759";
  const ownerJid = ownerRaw.includes("@s.whatsapp.net") ? ownerRaw : ownerRaw + "@s.whatsapp.net";
  
  global.sock = sock;
  global.settings = settings;
  global.signature = settings.signature || "> Queen Zaya V1";
  global.owner = ownerJid;
  global.ownerNumber = ownerRaw;
  
  sock.ev.on("creds.update", saveCreds);
  
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log("✅ [BOT ONLINE] Connected to WhatsApp!");
      rl.close();
    }
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log("❌ Disconnected. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });
  
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    try {
      await handleCommand(sock, msg);
    } catch (err) {
      console.error("❌ Command error:", err && err.stack ? err.stack : err);
    }
  });
  
  if (!state.creds?.registered) {
    const phoneNumber = await question("📱 Enter your WhatsApp number (with country code): ");
    await sock.requestPairingCode(phoneNumber.trim());
    setTimeout(() => {
      const code = sock.authState.creds?.pairingCode;
      if (code) {
        console.log("\n🔗 Pair this device using this code in WhatsApp:\n");
        console.log("   " + code + "\n");
        console.log("Go to WhatsApp → Linked Devices → Link with code.");
      } else {
        console.log("❌ Pairing code not found.");
      }
    }, 1000);
  }
}
startBot();