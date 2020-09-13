const Discord = require('discord.js')
const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['<Message URL>'],
    }
    super('msg', opts)
  }

  async run(msg, lang, args) {
    if (!args[1]) return
    if (!/discordapp\.com\/channels\/(.*)\/(.*)\/(.*)$/.test(args[1])) return
    const regex = /discordapp\.com\/channels\/(.*)\/(.*)\/(.*)$/.exec(args[1])
    const sguild = regex[1]
    const schannel = regex[2]
    const message = regex[3]
    let channel
    let guild
    if (sguild === '@me') {
      const user = await msg.client.channels.fetch(schannel).catch(e => {
        console.error(e)
        return null
      })
      if (!user) return
      channel = user
      guild = { name: `DM: ${user.recipient.tag} (${user.recipient.id})`, avatar: user.recipient.avatarURL() }
    } else {
      channel = await msg.client.channels.fetch(schannel).catch(e => {
        console.error(e)
        return null
      })
      if (!channel) return
      if (channel.constructor.name !== 'TextChannel') return
      guild = { name: `#${channel.name} - ${channel.guild.name}`, avatar: channel.guild.iconURL() }
    }
    const fetched = await channel.messages.fetch(message).catch(e => {
      console.error(e)
      return null
    })
    if (!fetched) return
    const embed = new Discord.MessageEmbed()
      .setURL(`https://discordapp.com/channels/${sguild}/${schannel}/${message}`)
      .setAuthor(fetched.author.tag, fetched.author.avatarURL())
      .setDescription(fetched.content)
      .setTimestamp(fetched.createdTimestamp)
      .setFooter(`${guild.name}`, guild.avatar)
    if (fetched.attachments && fetched.attachments.size != 0) embed.setImage(fetched.attachments.first().url)
    msg.channel.send(embed)
    if (fetched.embeds) fetched.embeds.forEach((embed, i) => {
      msg.channel.send(`Embed ${i+1}:`, { embed })
    })
  }
}
