'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _telebot = require('telebot');

var _telebot2 = _interopRequireDefault(_telebot);

var _token = require('./token.js');

var _messages = require('./messages.js');

var _messages2 = _interopRequireDefault(_messages);

var _webhook = require('../bitrix24/webhook.js');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserBot = function () {
  function UserBot() {
    _classCallCheck(this, UserBot);

    var _ = this;

    if (typeof _token.token == 'undefined' || _token.token == '') throw new Error('Error: You need to provide the bot token!');

    _.bot = new _telebot2.default(_token.token);
    _.webhook = new _webhook2.default();
    _.messages = new _messages2.default();
    _.parseHTML = { parseMode: 'html' };
  }

  _createClass(UserBot, [{
    key: 'getCRMLead',
    value: async function getCRMLead(id) {
      return this.webhook.trigger('crm.lead.get', { title: id });
    }
  }, {
    key: 'addCRMLead',
    value: async function addCRMLead(params) {
      return this.webhook.trigger('crm.lead.add', params);
    }
  }, {
    key: 'getCRMContact',
    value: async function getCRMContact(id) {
      return this.webhook.trigger('crm.contact.get', { web: 'https://telegram.me/' + id });
    }
  }, {
    key: 'addCRMContact',
    value: async function addCRMContact(params) {
      return this.webhook.trigger('crm.contact.add', params);
    }
  }, {
    key: 'saveGripe',
    value: function saveGripe(msg) {
      var id = msg.id,
          name = { first: msg.from.first_name, last: msg.from.last_name },
          uname = msg.from.username;

      var _ = this;

      _.getCRMLead('T:' + id).then(function (data) {
        var result = data.result;
        if (typeof result == 'undefined') {
          var params = {
            name: name.first,
            last_name: name.last,
            opened: 'Y',
            status_id: 'NEW',
            status_description: msg.text
          };

          _.addCRMLead(params).then(function (data) {
            var result = data.result;
            if (typeof result == 'undefined') return _.bot.sendMessage(id, _.messages.saveError, _.parseHTML);else return msg.reply.text(_.messages.savedGripe);
          }).catch(function (err) {
            console.log(err);
            return msg.reply.text(_.messages.internalError);
          });
        } else {
          return msg.reply.text('PASSB!');
        }
      }).catch(function (err) {
        console.log(err);
        return msg.reply.text(_.messages.internalError);
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      var _ = this,
          command = '',
          prompted = false;

      _.bot.on('*', function (msg) {
        var id = msg.from.id,
            name = { first: msg.from.first_name, last: msg.from.last_name },
            uname = msg.from.username;
        if (typeof msg.txt == 'undefined') {
          if (typeof msg.location != 'undefined') {
            var listDesa = _this.getDesaFromQuery(msg.location);
            return _.bot.sendMessage(id, _.messages.showListDesa(listDesa), _.parseHTML);
          }
        }
        var txt = msg.text,
            spr = txt.split(' '),
            cmd = spr[0],
            arg = spr.slice(1);
        switch (cmd) {
          case '/start':
            _.getCRMContact(uname).then(function (data) {
              var result = data.result;
              if (typeof result == 'undefined') {
                var params = {
                  'fields[IM]': 'Telegram',
                  'fields[WEB]': 'https://telegram.me/' + uname,
                  'fields[NAME]': name.first,
                  'fields[SECOND_NAME]': '',
                  'fields[LAST_NAME]': name.last,
                  'fields[TYPE_ID]': 'Clients',
                  'fields[SOURCE_ID]': 'User: T-' + id
                };

                _.addCRMContact(params).then(function (data) {
                  return console.log(data);
                }).catch(function (err) {
                  return console.log(err);
                });
              } else {}
            }).catch(function (err) {
              return console.log(err);
            });

            return _.bot.sendMessage(id, _.messages.welcome, _.parseHTML);
            break;
          case '/bantuan':
            var topic = arg[0];

            if (typeof topic != 'undefined') return _.bot.sendMessage(id, _.messages.helpTopic(topic), _.parseHTML);else return _.bot.sendMessage(id, _.messages.help, _.parseHTML);

            break;
          case '/perintah':
            return _.bot.sendMessage(id, _.messages.commands, _.parseHTML);
            break;
          case '/keluhan':
            command = txt;
            prompted = true;

            return msg.reply.text(_.messages.askGripe);
            break;
          default:
            if (prompted) {
              switch (command) {
                case '/keluhan':
                  command = '';
                  prompted = false;

                  _.saveGripe(msg);

                  break;
                default:
                  return _.bot.sendMessage(id, _.messages.unknownCommand(command), _.parseHTML);
              }
            } else return msg.reply.text(_.messages.unknow);
        }
      });

      _.bot.start();
    }
  }, {
    key: 'getDesaFromQuery',
    value: function getDesaFromQuery(location) {
      var query = '\n          SELECT ?desa ?desaLabel ?lat ?long ?kodeDesa WHERE {\n            ?desa p:P625 ?statement . # coordinate-location statement\n            ?desa wdt:P1588 ?kodeDesa .\n            ?statement psv:P625 ?coordinate_node .\n            ?coordinate_node wikibase:geoLatitude ?lat .\n            ?coordinate_node wikibase:geoLongitude ?long .\n          \n            FILTER (ABS(?lat - ' + location.latitude + ') < 0.1)\n            FILTER (ABS(?long - ' + location.longitude + ') < 0.1)\n          \n            SERVICE wikibase:label {\n              bd:serviceParam wikibase:language "en" .\n            }\n          } ORDER BY ASC(?lat)\n        ',
          wdk = require('wikidata-sdk'),
          url = wdk.sparqlQuery(query),
          req = require('sync-request'),
          tmp = req('GET', url),
          res = JSON.parse(tmp.getBody('utf8'));
      return res;
    }
  }]);

  return UserBot;
}();

module.exports = UserBot;