'use strict';

/*!
 * Messages Library
 * Provides bot reply messages
 */

var commands = 'Berikut ini adalah daftar perintah yang dapat Anda gunakan.\n' + '\n' + '/start - Memulai layanan K2D2\n' + '/bantuan - Menampilkan pesan bantuan\n' + '/bantuan &lt;topik&gt; - Menampilkan pesan bantuan mengenai topik ' + 'tertentu\n' + '/perintah - Menampilkan daftar perintah\n' + '/selesai - Mengakhiri layanan K2D2';

module.exports = {
  welcome: 'Selamat datang di layanan <b>K2D2</b>!\n' + '\n' + 'Gunakan perintah /bantuan untuk menampilkan pesan bantuan.',

  commands: commands,

  help: '<b>K2D2</b> adalah layanan ...\n' + '\n' + commands
};