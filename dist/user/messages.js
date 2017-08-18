'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserMessages = function UserMessages() {
  _classCallCheck(this, UserMessages);

  var _ = this;

  _.welcome = 'Selamat datang di layanan <b>K2D2</b>!\n' + '\n' + 'Gunakan perintah /bantuan untuk menampilkan pesan bantuan.';

  _.commands = 'Berikut ini adalah daftar perintah yang dapat Anda gunakan.\n' + '\n' + '/start - Memulai layanan K2D2\n' + '/bantuan - Menampilkan pesan bantuan\n' + '/bantuan &lt;topik&gt; - Menampilkan pesan bantuan mengenai topik ' + 'tertentu\n' + '/perintah - Menampilkan daftar perintah\n' + '/selesai - Mengakhiri layanan K2D2';

  _.help = '<b>K2D2</b> adalah layanan ...\n' + '\n' + _.commands;
};

module.exports = UserMessages;