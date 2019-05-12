const { ok_hand, x } = require('emojilib/emojis')
const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('nsfw')
  }

  async run(msg) {
    if (!msg.guild.roles.find(r => r.name === '🔑')) return msg.react(x.char)
    await msg.member.addRole(msg.guild.roles.find(r => r.name === '🔑'))
    msg.react(ok_hand.char)
  }
}
