const { BOT_NAME, ownerName } = require("../config/bot");

async function bannerMenu(stats, pluginCount, version, prefix, mode) {
  return `
╭━─〔 ${BOT_NAME} 〕━━╮
│ ✦ Owner: ${ownerName}
│ ✦ Prefix: ${prefix}
│ ✦ Plugins loaded: ${pluginCount}
│ ✦ Mode: ${mode}
│ ✦ Version: ${version}
│ ✦ RAM: ${stats.ram.used} / ${stats.ram.total}
│ ✦ Node: ${stats.node}
│ ✦ Uptime: ${stats.uptime}
│ ✦ CPU: ${stats.cpu} (${stats.cpus} cores)
│ ✦ Time: ${stats.time}
╰───────────────────╯

◪ ᴍᴀɪɴ ᴍᴇɴᴜ
│
├─ ❏ .menu
├─ ❏ .ping
├─ ❏ .repo
├─ ❏ .owner
├─ ❏ .sc
└─ ❏ .runtime

◪ ᴀɪ ᴍᴇɴᴜ
│
├─ ❏ .chatgpt
├─ ❏ .blackbox
├─ ❏ .gemini
├─ ❏ .deepseek
├─ ❏ .text2img

◪ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ
│
├─ ❏ .apk
├─ ❏ .play
├─ ❏ .video
├─ ❏ .gitclone
├─ ❏ .gdrive
└─ ❏ .dltiktok

◪ ᴏᴡɴᴇʀ ᴍᴇɴᴜ
│
├─ ❏ .private
├─ ❏ .public
├─ ❏ .autoreact
├─ ❏ .autotype
├─ ❏ .autobio
├─ ❏ .join
├─ ❏ .leave
├─ ❏ .block
├─ ❏ .unblock
├─ ❏ .antical
└─ ❏ .antibug

◪ ɢʀᴏᴜᴘ ᴍᴇɴᴜ
│
├─ ❏ .opengc
├─ ❏ .closegc
├─ ❏ .listonline
├─ ❏ .tagall
├─ ❏ .promote
├─ ❏ .demote
├─ ❏ .listadmin
├─ ❏ .kickall
├─ ❏ .add
├─ ❏ .kick
└─ ❏ .remove

— Powered by ${BOT_NAME}
`;
}
module.exports = { bannerMenu };