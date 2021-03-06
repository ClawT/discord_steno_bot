const Discord = require('discord.js')
const Steno = require('./steno.js')
const stenoToBuffer = Steno.stenoToBuffer
const normalizeUrlSafe = Steno.normalizeUrlSafe
const token = require('./token').token // Need a token.json with: { "token": "TOKEN HERE" }

const bot = new Discord.Client()

bot.on('ready', () => {
  console.log('I am ready!')
})

const stenoGroups = /`([A-Z#\d\/ \*-]+)`/g

bot.on('message', message => {
  try {
    const content = message.content
    const channel = message.channel.name
    const summoned = channel === 'learners' || content.startsWith('!')
    let steno = content.match(stenoGroups)
    if (steno && summoned) {
      if (Array.isArray(steno)) {
        steno = steno.join(' ')
      }
      console.log('Processing ', steno)
      const buffer = stenoToBuffer(steno)
      if (buffer) {
        message.channel.sendFile(buffer, normalizeUrlSafe(steno) + '.png')
      } else {
        message.react('❓')
      }
    }
  } catch (e) {
    console.log('Something went wrong while handling a message.')
    console.err(e)
  }
})

bot.login(token)
