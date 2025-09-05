const axios = require('axios');
module.exports = {
  command: 'gitclone',
  handler: async (ctx, sendBanner) => {
    const repo = ctx.message.text.split(' ').slice(1).join(' ');
    if (!repo) return sendBanner(ctx, 'Usage: .gitclone <repo-url>');
    try {
      // Using public git-clone API (glitch/third-party)
      const res = await axios.get(`https://api.github.com/repos/${repo.replace('https://github.com/', '')}/zipball/`);
      await sendBanner(ctx, `*GitClone:*\n${res.request.res.responseUrl}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to clone repo. Use: .gitclone <repo-url>');
    }
  }
};