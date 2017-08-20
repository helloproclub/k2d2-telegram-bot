import TeleBot  from 'telebot'
import {token}  from './token.js'
import Messages from './messages.js'
import WebHook  from '../bitrix24/webhook.js'

class UserBot {
  constructor() {
    let _ = this

    if (typeof(token) == 'undefined' || token == '')
      throw new Error('Error: You need to provide the bot token!')

    _.bot       = new TeleBot(token)
    _.webhook   = new WebHook()
    _.messages  = new Messages()
    _.parseHTML = {parseMode: 'html'}
  }

  async getCRMLead(id) {
    return this.webhook.trigger('crm.lead.get', {title: id})
  }

  async addCRMLead(params) {
    return this.webhook.trigger('crm.lead.add', params)
  }

  async getCRMContact(id) {
    return this.webhook.trigger(
      'crm.contact.get', {web: `https://telegram.me/${id}`}
    )
  }

  async addCRMContact(params) {
    return this.webhook.trigger('crm.contact.add', params)
  }

  saveGripe(msg) {
    const id      = msg.id
        , name    = {first: msg.from.first_name, last: msg.from.last_name}
        , uname   = msg.from.username

    let _ = this

    _.getCRMLead(`T:${id}`)
    .then(data => {
      const result = data.result
      if (typeof(result) == 'undefined')
      {
        const params = {
          name: name.first
        , last_name: name.last
        , opened: 'Y'
        , status_id: 'NEW'
        , status_description: msg.text
        }

        _.addCRMLead(params)
        .then(data => {
          const result = data.result
          if (typeof(result) == 'undefined')
            return _.bot.sendMessage(id, _.messages.saveError, _.parseHTML)
          else
            return msg.reply.text(_.messages.savedGripe)
        })
        .catch(err => {
          console.log(err)
          return msg.reply.text(_.messages.internalError)
        })
      }
      else
      {
        return msg.reply.text('PASSB!')
      }
    })
    .catch(err => {
      console.log(err)
      return msg.reply.text(_.messages.internalError)
    })
  }

  run() {
    let _         = this
      , command   = ''
      , prompted  = false

    _.bot.on('*', (msg) => {
      const id    = msg.from.id
          , name  = {first: msg.from.first_name, last: msg.from.last_name}
          , uname = msg.from.username
          , txt   = msg.text
          , spr   = txt.split(' ')
          , cmd   = spr[0]
          , arg   = spr.slice(1)

      console.log(msg)

      switch (cmd) {
        case '/start':
          _.getCRMContact(uname)
          .then(data => {
            const result = data.result
            if (typeof(result) == 'undefined')
            {
              const params = {
                'fields[IM]': 'Telegram'
              , 'fields[WEB]': `https://telegram.me/${uname}`
              , 'fields[NAME]': name.first
              , 'fields[SECOND_NAME]': ''
              , 'fields[LAST_NAME]': name.last
              , 'fields[TYPE_ID]': 'Clients'
              , 'fields[SOURCE_ID]': `User: T-${id}`
              }

              _.addCRMContact(params)
              .then(data => console.log(data))
              .catch(err => console.log(err))
            }
            else
            {

            }
          })
          .catch(err => console.log(err))

          return _.bot.sendMessage(id, _.messages.welcome, _.parseHTML)
          break
        case '/bantuan':
          const topic = arg[0]

          if (typeof(topic) != 'undefined')
            return _.bot.sendMessage(id, _.messages.helpTopic(topic), _.parseHTML)
          else
            return _.bot.sendMessage(id, _.messages.help, _.parseHTML)

          break
        case '/perintah':
          return _.bot.sendMessage(id, _.messages.commands, _.parseHTML)
          break
        case '/keluhan':
          command  = txt
          prompted = true

          return msg.reply.text(_.messages.askGripe)
          break
        default:
          if (prompted)
          {
            switch (command)
            {
              case '/keluhan':
                command   = ''
                prompted  = false

                _.saveGripe(msg)

                break
              default:
                return _.bot.sendMessage(
                  id
                , _.messages.unknownCommand(command)
                , _.parseHTML
                )
            }
          }
          else return msg.reply.text(_.messages.unknow)
      }
    })

    _.bot.start()
  }
}

module.exports = UserBot
