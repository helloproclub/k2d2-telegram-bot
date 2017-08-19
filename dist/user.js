'use strict';

var _bot = require('./user/bot.js');

var _bot2 = _interopRequireDefault(_bot);

var _messages = require('./user/messages.js');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User() {
  _classCallCheck(this, User);

  var _ = this;

  _.bot = new _bot2.default();
  _.messages = new _messages2.default();
};

module.exports = User;