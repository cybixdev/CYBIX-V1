function isOwner(ctx) {
  const ownerId = process.env.OWNER_ID;
  return ctx.from && (ctx.from.id.toString() === ownerId.toString());
}

function getMenuCaption(ctx, config, users) {
  const prefix = Array.isArray(config.prefix) ? config.prefix.join(' ') : config.prefix;
  return (
    `╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${prefix}
│ ✦ ᴏᴡɴᴇʀ : ${config.ownerName || 'Unknown'}
│ ✦ ᴜsᴇʀ : ${ctx.from?.first_name || '-'}
│ ✦ ᴜsᴇʀ ɪᴅ : ${ctx.from?.id || '-'}
│ ✦ ᴜsᴇʀs : ${users.length}
│ ✦ sᴘᴇᴇᴅ : ${Math.floor(Math.random() * 10 + 1)}ms
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘʟᴜɢɪɴs : ${config.plugins || 0}
│ ✦ ᴠᴇʀsɪᴏɴ : ${config.version}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${new Date().toLocaleTimeString()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${new Date().toLocaleDateString()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • ᴄʜᴀᴛɢᴘᴛ
┃ • ᴏᴘᴇɴᴀɪ
┃ • ʙʟᴀᴄᴋʙᴏx
┃ • ɢᴇᴍɪɴɪ
┃ • ᴅᴇᴇᴘsᴇᴇᴋ
┃ • ᴛᴇxᴛ2ɪᴍɢ
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • ᴀᴘᴋ
┃ • sᴘᴏᴛɪғʏ
┃ • ɢɪᴛᴄʟᴏɴᴇ
┃ • ᴍᴇᴅɪᴀғɪʀᴇ
┃ • ᴘʟᴀʏ
┃ • ɢᴅʀɪᴠᴇ 
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • ʀᴇᴘᴏ
┃ • ᴘɪɴɢ
┃ • ʀᴜɴᴛɪᴍᴇ
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xᴠɪᴅᴇᴏsᴇᴀʀᴄʜ
┃ • xɴxxsᴇᴀʀᴄʜ
┃ • ᴅʟ-xɴxxᴠɪᴅ
┃ • ᴅʟ-xᴠɪᴅᴇᴏ
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • sᴛᴀᴛɪᴄs
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ʟᴏɢs
┃ • sᴇᴛʙᴀɴɴᴇʀ
┃ • sᴇᴛᴘʀᴇғɪx
┃ • sᴇᴛʙᴏᴛɴᴀᴍᴇ
╰━━━━━━━━━━━━━━━

ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒`
  );
}

function getBannerAndButtons() {
  return {
    photo: 'https://files.catbox.moe/2x9p8j.jpg',
    buttons: [
      [
        { text: 'Telegram Channel', url: 'https://t.me/cybixtech' }
      ]
    ]
  };
}

module.exports = {
  isOwner,
  getMenuCaption,
  getBannerAndButtons
};