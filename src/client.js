const logger = require('./util/logger').getLogger('client', 'purple')
logger.info('Initializing')
const config = require('./config.json')
const app = require('./appconfig')
const Discord = require('discord.js')
const client = new Discord.Client();

client.on('ready', () => {
  logger.info(app.name + ' is ready!')
})

client.on('presenceUpdate', (og, nm) => {
  if (!nm.presence.game) return
  const game = nm.presence.game
  if (game.applicationID !== '367827983903490050') return // <- return if application id isn't osu client
  if (!/^(.*?) - (.*) \[(.*)\]$/g.test(game.details)) return
  const [ beatmap, artist, name, difficulty ] = /^(.*?) - (.*) \[(.*)\]$/g.exec(game.details) // (Artist) - (Beatmap) [(Difficulty)]
  const [ namerank, osuname, rank ] = /(.*?) \(rank (.*)\)/.exec(game.assets.largeText) // (osu Username) - \(rank (#Rank)\)
  const embed = new Discord.RichEmbed()
    .setTitle(`${osuname} (${nm.user.tag}) is ${game.state.toLowerCase()}`)
    .setURL(`https://acrylicstyle.xyz/osu/spectate/${encodeURI(osuname)}`)
    .addField('Beatmap URL', `https://osu.ppy.sh/beatmapsets?q=${encodeURI(beatmap)}&s=7`)
    .addField('User Profile', `https://osu.ppy.sh/u/${osuname}`)
    .addField('Artist', artist)
    .addField('Beatmap Name', name)
    .addField('Difficulty Name', difficulty)
    .addField('Current player rank', rank)
    .setColor([0,255,0])
  if (game.state === 'Spectating') {
    !nm.guild.channels.find(c => c.name === 'now-spectating') || nm.guild.channels.find(c => c.name === 'now-spectating').send(embed)
  } else {
    !nm.guild.channels.find(c => c.name === 'now-playing') || nm.guild.channels.find(c => c.name === 'now-playing').send(embed)
  }
})

client.login(config.token)
