const { sendForwarded } = require("../../libs/forwarded");
const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: ".gitclone",
  run: async (sock, m, args) => {
    if (!args.length)
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .gitclone <github repo url>" });
    const url = args[0];
    const repoName = `repo-${Date.now()}`;
    await sendForwarded(sock, m.key.remoteJid, { text: "⏳ Cloning repository..." });
    exec(`git clone ${url} ${repoName}`, async (err) => {
      if (err) {
        await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to clone repository." });
        return;
      }
      // Zip and send the repo
      const zipFile = `${repoName}.zip`;
      const archiver = require("archiver");
      const output = fs.createWriteStream(zipFile);
      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(output);
      archive.directory(repoName, false);
      archive.finalize();
      output.on("close", async () => {
        await sock.sendMessage(m.key.remoteJid, {
          document: { url: path.resolve(zipFile) },
          fileName: zipFile,
          mimetype: "application/zip",
          caption: `✅ Repository cloned and zipped: ${zipFile}`
        });
        fs.removeSync(repoName);
        fs.removeSync(zipFile);
      });
    });
  }
};