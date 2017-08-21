'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserMessages = function UserMessages() {
  _classCallCheck(this, UserMessages);

  var _ = this;

  _.welcome = 'Selamat datang di layanan <b>K2D2</b>!\n' + '\n' + 'Gunakan perintah /bantuan untuk menampilkan pesan bantuan.';

  _.commands = 'Berikut ini adalah daftar perintah yang dapat Anda gunakan.\n' + '\n' + '/start - Memulai layanan K2D2\n' + '/bantuan - Menampilkan pesan bantuan\n' + '/bantuan <b>topik</b> - Menampilkan pesan bantuan mengenai topik ' + 'tertentu\n' + '/perintah - Menampilkan daftar perintah\n' + '/keluhan - Mengirim keluhan Anda kepada kami\n' + '/selesai - Mengakhiri layanan K2D2';

  _.help = '<b>K2D2</b> adalah layanan ...\n' + '\n' + 'Gunakan /perintah untuk menampilkan perintah apa saja yang tersedia.';

  _.helpTopic = function (topic) {
    switch (topic) {
      case '/perintah':
        return '/perintah merupakan sebuah perintah yang digunakan untuk ' + 'menampilkan perintah apa saja yang tersedia.';
      case '/keluhan':
        return 'Setelah Anda menjalankan perintah /keluhan, kami akan ' + 'meminta Anda menulis semua keluhan dan mengirimkannya ' + 'kembali.';
      default:
        return 'Topik yang diminta tidak ada.';
    }
  };

  _.showListDesa = function (data) {
    var ret = 'Desa Terdekat\n\n';
    var listDesa = data.results.bindings;
    listDesa.forEach(function (desa) {
      ret += desa.kodeDesa.value + ' - ' + desa.desaLabel.value + '\n';
    });
    return ret;
  };

  _.unknow = 'Kami tidak mengerti.\n' + 'Gunakan perintah /bantuan untuk menampilkan pesan bantuan.';

  _.saveError = 'Kami tidak dapat menyimpannya.\n' + 'Sepertinya terjadi kesalahan pada <i>server</i> kami.\n' + 'Cobalah untuk mengirim ulang setelah beberapa saat.';

  _.askGripe = 'Silakan tulis dan kirim keluhan Anda.';

  _.savedGripe = 'Keluhan Anda sudah kami terima.';

  _.unknownCommand = function (cmd) {
    return 'Perintah <b>' + cmd + '</b> tidak dikenali...';
  };

  _.internalError = 'Ups! Terjadi kesalahan internal pada server.\n' + 'Kami tidak dapat mengambil data dari server.\n' + 'Cobalah untuk mengirim ulang setelah beberapa saat atau laporkan ' + 'masalah ini kepada administrator kami.';
};

module.exports = UserMessages;