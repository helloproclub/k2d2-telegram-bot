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
      const id  = msg.from.id
          , name  = {first: msg.from.first_name, last: msg.from.last_name}
          , uname = msg.from.username
      if (typeof(msg.txt) == 'undefined') {
        if (typeof(msg.location) != 'undefined') {
          const listDesa = this.getDesaFromQuery(msg.location);
          return _.bot.sendMessage(id, _.messages.showListDesa(listDesa), _.parseHTML)
        }
      }
      const txt = msg.text
          , spr = txt.split(' ')
          , cmd = spr[0]
          , arg = spr.slice(1)
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

  getDesaFromQuery(location) {
    const
        query =  `
          SELECT ?desa ?desaLabel ?lat ?long ?kodeDesa WHERE {
            ?desa p:P625 ?statement . # coordinate-location statement
            ?desa wdt:P1588 ?kodeDesa .
            ?statement psv:P625 ?coordinate_node .
            ?coordinate_node wikibase:geoLatitude ?lat .
            ?coordinate_node wikibase:geoLongitude ?long .
          
            FILTER (ABS(?lat - `
          + location.latitude
          + `) < 0.1)
            FILTER (ABS(?long - `
          + location.longitude
          + `) < 0.1)
          
            SERVICE wikibase:label {
              bd:serviceParam wikibase:language "en" .
            }
          } ORDER BY ASC(?lat)
        `
        , wdk = require('wikidata-sdk')
        , url = wdk.sparqlQuery(query)
        , req = require('sync-request')
        , tmp = req('GET', url)
        , res = JSON.parse(tmp.getBody('utf8'));
    return res;
  }
}

module.exports = UserBot
