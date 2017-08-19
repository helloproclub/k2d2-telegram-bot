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

    if (typeof _token.token == 'undefined' || _token.token == '') throw new Error('Error: You need to provide the bot token!');
  }

  _createClass(UserBot, [{
    key: 'run',
    value: function run() {
      var command = '',
          prompted = false;

      var bot = new _telebot2.default(_token.token),
          webhook = new _webhook2.default(),
          messages = new _messages2.default(),
          parseHTML = { parseMode: 'html' };

      bot.on('*', function (msg) {
        var id = msg.from.id,
            txt = msg.text,
            spr = txt.split(' '),
            cmd = spr[0],
            arg = spr.slice(1);

        switch (cmd) {
          case '/start':
            return bot.sendMessage(id, messages.welcome, parseHTML);
          case '/bantuan':
            var topic = arg[0];

            if (typeof topic != 'undefined') return bot.sendMessage(id, messages.helpTopic(topic), parseHTML);else return bot.sendMessage(id, messages.help, parseHTML);
          case '/perintah':
            return bot.sendMessage(id, messages.commands, parseHTML);
          case '/keluhan':
            command = txt;
            prompted = true;

            return msg.reply.text(messages.askGripe);
          default:
            if (prompted) {
              switch (command) {
                case '/keluhan':
                  command = '';
                  prompted = false;

                  webhook.trigger('profile').then(function (data) {
                    if (data == {}) return bot.sendMessage(id, messages.saveError, parseHTML);else return msg.reply.text(messages.savedGripe);
                  });
                  break;
                default:
                  return bot.sendMessage(id, messages.unknownCommand(command), parseHTML);
              }
            } else return msg.reply.text(messages.unknow);
        }
      });

      bot.start();
    }
  }]);

  return UserBot;
}();

module.exports = UserBot;