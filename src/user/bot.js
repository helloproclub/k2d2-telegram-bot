import TeleBot  from 'telebot'
import {token}  from './token.js'
import Messages from './messages.js'

class UserBot {
  constructor() {
    if (typeof(token) == 'undefined' || token == '')
      throw new Error('Error: You need to provide the bot token!')
  }

  run() {
    let command   = ''
      , prompted  = false

    const bot       = new TeleBot(token)
        , messages  = new Messages()
        , parseHTML = {parseMode: 'html'}

    bot.on('*', (msg) => {
      const id  = msg.from.id
          , txt = msg.text
          , spr = txt.split(' ')
          , cmd = spr[0]
          , arg = spr.slice(1)

      switch (cmd) {
        case '/start':
          return bot.sendMessage(id, messages.welcome, parseHTML)
        case '/bantuan':
          const topic = arg[0]

          if (typeof(topic) != 'undefined')
            return bot.sendMessage(id, messages.helpTopic(topic), parseHTML)
          else
            return bot.sendMessage(id, messages.help, parseHTML)
        case '/perintah':
          return bot.sendMessage(id, messages.commands, parseHTML)
        case '/keluhan':
          command  = txt
          prompted = true

          return msg.reply.text(messages.askGripe)
        default:
          if (prompted)
          {
            switch (command)
            {
              case '/keluhan':
                command   = ''
                prompted  = false

                return msg.reply.text(messages.savedGripe)
              default:
                return bot.sendMessage(
                  id
                , messages.unknownCommand(command)
                , parseHTML
                )
            }
          }
          else return msg.reply.text(messages.unknow)
      }
    })

    bot.start()
  }
}

module.exports = UserBot
