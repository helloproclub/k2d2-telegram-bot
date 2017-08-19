'use strict';

var _b = require('b24');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitrix24WebHook = function Bitrix24WebHook() {
  _classCallCheck(this, Bitrix24WebHook);

  var _ = this;

  _.url = 'k2d2';
  _.user = '8';
  _.token = 'lr3zedw9d6kvx233';
  _.config = {
    config: {
      mode: 'webhook',
      host: _.url,
      user_id: _.user,
      code: _.token
    }
  };
  _.bitrix24 = new _b.Bitrix24(_.config);

  _.trigger = async function (point) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    try {
      var res = await _.bitrix24.callMethod(point, params);

      return res;
    } catch (err) {
      console.log(err);
      return {};
    }
  };
};

module.exports = Bitrix24WebHook;