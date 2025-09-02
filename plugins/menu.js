const os = require('os');
module.exports = async (bot, sendBanner, config, ctx, version) => {
  const now = new Date();
  const harareTime = now.toLocaleTimeString('en-US', { timeZone: config.timeZone });
  const harareDate = now.toLocaleDateString('en-US', { timeZone: config.timeZone });
  const uptime = `${process.uptime().toFixed(0)}s`;
  const ram = `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  
  const menu = `
╭━━〔 CYBIX-V1 MENU 〕━━╮
│ ✦ Prefix : [ . ] or [ / ]
│ ✦ Owner : ${config.ownerId}
│ ✦ User : ${ctx?.from?.first_name || 'User'}
│ ✦ Version : ${version}
│ ✦ Uptime : ${uptime}
│ ✦ Time Now : ${harareTime}
│ ✦ Date Today : ${harareDate}
│ ✦ Time Zone : Africa/Harare
│ ✦ Server RAM : ${ram}
╰───────────────────╯

╭━✦❮ AI MENU ❯✦━⊷
┃ chatgpt
┃ gemini
┃ llama
┃ imggen
┃ blackbox
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ DL MENU ❯✦━⊷
┃ apk
┃ song
┃ image
┃ play
┃ yts
┃ ytmp4
┃ gitclone
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ NSFW MENU ❯✦━⊷
┃ nsfw
┃ lewd
┃ xvideos
┃ xhamster
┃ rule34
┃ boobs
┃ ass
┃ hentaiimg
┃ nsfwgif
┃ ecchi
┃ yandere
┃ oppai
┃ feet
┃ cum
┃ peeing
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ HENTAI MENU ❯✦━⊷
┃ hebati
┃ hentai
┃ doujin
┃ nekopoi
┃ waifu18
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ PORN MENU ❯✦━⊷
┃ porn
┃ sextube
┃ pornhub
┃ milf
┃ ebony
┃ lesbian
┃ gangbang
┃ gloryhole
┃ dp
┃ anal
┃ blowjob
┃ facial
┃ cumshot
┃ creampie
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ ADULT MENU ❯✦━⊷
┃ adult
┃ bdsm
┃ femdom
┃ japan18
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ DEVELOPER ❯✦━⊷
┃ devinfo
┃ broadcast
┃ killall
┃ stats
┃ restart
┃ update
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ USEFUL MENU ❯✦━⊷
┃ shorten
┃ weather
┃ news
┃ currency
┃ crypto
┃ translate
┃ qr
┃ uuid
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ FUN MENU ❯✦━⊷
┃ waifu
┃ meme
┃ joke
┃ anime
┃ roast
┃ diss
╰━━━━━━━━━━━━━━━━━⊷
`;
  
  await sendBanner(ctx, menu);
};