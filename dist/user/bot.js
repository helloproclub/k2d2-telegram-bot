'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _telebot = require('telebot');

var _telebot2 = _interopRequireDefault(_telebot);

var _token = require('./token.js');

var _messages = require('./messages.js');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserBot = function () {
  function UserBot() {
    _classCallCheck(this, UserBot);

    var _ = this;

    if (typeof _token.token == 'undefined' || _token.token == '') throw new Error('Error: You need to provide the bot token!');

    _.bot = new _telebot2.default(_token.token);
    _.messages = new _messages2.default();
    _.parseOpts = { parseMode: 'html' };
  }

  _createClass(UserBot, [{
    key: 'run',
    value: function run() {
      var _ = this;

      _.bot.on('/start', function (msg) {
        return _.bot.sendMessage(msg.from.id, _.messages.welcome, _.parseOpts);
      });

      _.bot.on('/bantuan', function (msg) {
        return _.bot.sendMessage(msg.from.id, _.messages.help, _.parseOpts);
      });

      _.bot.on('/perintah', function (msg) {
        return _.bot.sendMessage(msg.from.id, _.messages.commands, _.parseOpts);
      });

      _.bot.start();
    }
  }]);

  return UserBot;
}();

module.exports = UserBot;