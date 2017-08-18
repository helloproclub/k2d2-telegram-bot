import TeleBot  from 'telebot'
import {token}  from './token.js'
import Messages from './messages.js'

class UserBot {
  constructor() {
    var _ = this

    if (typeof(token) == 'undefined' || token == '')
      throw new Error('Error: You need to provide the bot token!')

    _.bot      = new TeleBot(token)
    _.messages = new Messages()

    _.parseOpts = {
      parseMode: 'html'
    }
  }

  run() {
    var _ = this

    _.bot.on('/start', (msg) =>
        _.bot.sendMessage(msg.from.id, _.messages.welcome, _.parseOpts)
      )

    _.bot.on('/bantuan', (msg) =>
        _.bot.sendMessage(msg.from.id, _.messages.help, _.parseOpts)
      )

    _.bot.on('/perintah', (msg) =>
        _.bot.sendMessage(msg.from.id, _.messages.commands, _.parseOpts)
      )

    _.bot.start()
  }
}

module.exports = UserBot
