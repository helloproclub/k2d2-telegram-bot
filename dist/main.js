'use strict';

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _express2.default(),
    user = new _user2.default();

user.bot.run();

app.set('port', process.env.PORT || 5000);

app.get('/', function (req, res) {
    res.send('OK');
}).listen(app.get('port'), function () {
    console.log('Bot is running, listening on port ', app.get('port'));
});