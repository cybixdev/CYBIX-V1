const fs = require('fs');
const path = require('path');

function getStats() {
  let users = [];
  let groups = [];
  try { users = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/users.json'))); } catch { users = []; }
  try { groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/groups.json'))); } catch { groups = []; }
  return {
    userCount: users.length || 0,
    groupCount: groups.length || 0,
    runtime: process.uptime() ? `${Math.floor(process.uptime()/60)}m ${Math.floor(process.uptime()%60)}s` : "0m 0s"
  };
}

module.exports = (bot, sendBannerAndButtons) => {
  bot.command(['menu'], async ctx => {
    const stats = getStats();
    const menu = `
╭━━━[ CYBIX V1 MENU ]━━━╮
┃ Users: ${stats.userCount}
┃ Groups: ${stats.groupCount}
┃ Runtime: ${stats.runtime}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━【 MAIN MENU 】━━
┃ • .menu
╰━━━━━━━━━━━━━━━

╭━━【 AI MENU 】━━
┃ • .chatgpt
┃ • .deepseek
┃ • .blackbox
┃ • .bard
┃ • .llama
┃ • .gemini
┃ • .mixtral
┃ • .codegpt
┃ • .mistral
┃ • .suno
╰━━━━━━━━━━━━━━━

╭━━【 DOWNLOAD MENU 】━━
┃ • .apk
┃ • .play
┃ • .video
┃ • .gitclone
┃ • .instadl
┃ • .tiktokdl
┃ • .twimg
┃ • .fbvideo
┃ • .docdl
┃ • .wallpaper
╰━━━━━━━━━━━━━━━

╭━━【 NSFW MENU 】━━
┃ • .hentai
┃ • .lewd
┃ • .nsfwimg
┃ • .adultjoke
┃ • .boobs
┃ • .ass
┃ • .thighs
┃ • .ecchi
┃ • .yaoi
┃ • .yuri
┃ • .feet
┃ • .trap
┃ • .cum
┃ • .blowjob
┃ • .doujin
┃ • .gonewild
╰━━━━━━━━━━━━━━━

╭━━【 ADULT MENU 】━━
┃ • .pornvid
┃ • .pornimg
┃ • .moans
┃ • .sexaudio
┃ • .sexstory
┃ • .adultmp3
┃ • .adultgif
╰━━━━━━━━━━━━━━━

╭━━【 FUN MENU 】━━
┃ • .meme
┃ • .cat
┃ • .dog
┃ • .fox
┃ • .quote
┃ • .fact
┃ • .joke
┃ • .advice
┃ • .trivia
┃ • .anime
┃ • .waifu
┃ • .truth
┃ • .dare
╰━━━━━━━━━━━━━━━

╭━━【 OTHER MENU 】━━
┃ • .runtime
┃ • .ping
┃ • .buybot
┃ • .repo
┃ • .help
┃ • .profile
┃ • .support
╰━━━━━━━━━━━━━━━

╭━━【 EXTRA MENU 】━━
┃ • .iplookup
┃ • .randomfact
┃ • .animalfact
┃ • .math
┃ • .horoscope
┃ • .changelog
╰━━━━━━━━━━━━━━━

╭━━【 DEV MENU 】━━
┃ • .broadcast
┃ • .statics
┃ • .mode
┃ • .listusers
┃ • .logs
╰━━━━━━━━━━━━
    `;
    await sendBannerAndButtons(ctx, menu);
  });
};