const fs = require("fs");
const path = require("path");
const premiumFile = path.join(__dirname, "../data/premium.json");

function loadPremium() {
  try {
    const data = fs.readFileSync(premiumFile, "utf8");
    const arr = JSON.parse(data);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function savePremium(users) { fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2)); }
function isPremium(id) { return loadPremium().includes(Number(id)); }
function addPremium(id) {
  const users = loadPremium();
  if (!users.includes(Number(id))) { users.push(Number(id)); savePremium(users); }
}
function removePremium(id) {
  const users = loadPremium().filter(u => u !== Number(id));
  savePremium(users);
}
function listPremium() { return loadPremium(); }
module.exports = { isPremium, addPremium, removePremium, listPremium };