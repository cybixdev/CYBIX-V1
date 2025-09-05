const { Low, JSONFile } = require('lowdb');
const path = require('path');

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initConfig() {
  await db.read();
  db.data ||= {
    prefix: ['.', '/'],
    banner: 'https://files.catbox.moe/7dozqn.jpg',
    botName: 'CYBIX V1',
  };
  await db.write();
}

async function getPrefix() {
  await db.read();
  return db.data?.prefix || ['.', '/'];
}

async function setPrefix(newPrefix) {
  await db.read();
  db.data.prefix = Array.isArray(newPrefix) ? newPrefix : [newPrefix];
  await db.write();
}

async function getBotName() {
  await db.read();
  return db.data?.botName || 'CYBIX V1';
}

async function setBotName(name) {
  await db.read();
  db.data.botName = name;
  await db.write();
}

async function getBanner() {
  await db.read();
  return db.data?.banner || 'https://files.catbox.moe/7dozqn.jpg';
}

async function setBanner(url) {
  await db.read();
  db.data.banner = url;
  await db.write();
}

module.exports = {
  initConfig,
  getPrefix,
  setPrefix,
  getBotName,
  setBotName,
  getBanner,
  setBanner
};