const logger = require('logger.js').LoggerFactory.getLogger('client', 'purple')
logger.info('Initializing')
require('bot-framework/commands')
const dispatcher = require('bot-framework/dispatcher')
const config = require('./config.json')
const app = require('./appconfig')
const Discord = require('discord.js')
const client = new Discord.Client();
const prefix = 'o!'

client.on('ready', () => {
  client.user.setActivity(`${prefix}help`)
  logger.info(app.name + ' is ready!')
})

client.on('message', async msg => {
  if (msg.content.startsWith(prefix)) {
    logger.info(`${msg.author.tag} issued command: ${msg.content}`)
    await dispatcher(msg, require('./lang/en.json'), prefix, ['346957854445404160', '575673035743559701'], prefix)
  }
})

client.on('presenceUpdate', (og, nm) => {
  if (!nm.activities.filter(a => a.type === 'PLAYING').length === 0) return
  const game = nm.activities.filter(a => a.type === 'PLAYING')[0]
  if (game.applicationID !== '367827983903490050') return // <- return if application id isn't osu client
  if (!/^(.*?) - (.*) \[(.*)\]$/g.test(game.details)) return
  const [ beatmap, artist, name, difficulty ] = /^(.*?) - (.*) \[(.*)\]$/g.exec(game.details) // (Artist) - (Beatmap) [(Difficulty)]
  const [ namerank, osuname, rank ] = /(.*?) \(rank (.*)\)/.exec(game.assets.largeText) // (osu Username) - \(rank (#Rank)\)
  const embed = new Discord.MessageEmbed()
    .setTitle(`${osuname} (${nm.user.tag}) is ${game.state.toLowerCase()}`)
    .setURL(`https://acrylicstyle.xyz/osu/spectate/${encodeURI(osuname)}`)
    .addField('Beatmap URL', `https://osu.ppy.sh/beatmapsets?q=${encodeURI(beatmap)}&s=7`)
    .addField('User Profile', `https://osu.ppy.sh/u/${encodeURI(osuname)}`)
    .addField('Artist', artist)
    .addField('Beatmap Name', name)
    .addField('Difficulty Name', difficulty)
    .addField('Current player rank', rank)
    .setColor([0,255,0])
  if (game.state.toLowerCase().includes('spectating')) {
    !nm.guild.channels.cache.find(c => c.name === 'now-spectating') || nm.guild.channels.cache.find(c => c.name === 'now-spectating').send(embed)
  } else {
    !nm.guild.channels.cache.find(c => c.name === 'now-playing') || nm.guild.channels.cache.find(c => c.name === 'now-playing').send(embed)
  }
})

client.login(config.token)
