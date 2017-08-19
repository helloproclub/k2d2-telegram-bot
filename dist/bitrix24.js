'use strict';

var _webhook = require('./bitrix24/webhook.js');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitrix24 = function Bitrix24() {
  _classCallCheck(this, Bitrix24);

  var _ = this;

  _.webhook = new _webhook2.default();
};

module.exports = Bitrix24;