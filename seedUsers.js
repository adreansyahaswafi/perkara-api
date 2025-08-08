const mongoose = require('mongoose');
const dayjs = require('dayjs');
const LaporanPolisi = require('./models/reportModel');

mongoose.connect('mongodb://root:root@ac-jjfnmw4-shard-00-00.88lz053.mongodb.net:27017,ac-jjfnmw4-shard-00-01.88lz053.mongodb.net:27017,ac-jjfnmw4-shard-00-02.88lz053.mongodb.net:27017/perkara?ssl=true&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Helper to get formatted string date
const formatDate = (daysAgo = 0) =>
  dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm');

const dummyNames = ["Andi", "Budi", "Santi", "Joko", "Nia", "Rudi", "Tini", "Eko", "Lina"];
const lokasiList = ["Jl. Merdeka", "Jl. Sudirman", "Jl. Gajah Mada"];
const pasalList = ["Pasal 362 KUHP", "Pasal 351 KUHP", "Pasal 378 KUHP"];
const statusList = ["proses", "selesai", "sidang"];
const petugasList = ["Briptu Ardi", "Aiptu Dedi", "Iptu Rika"];

const seedLaporan = async () => {
  try {
    const data = Array.from({ length: 30 }).map((_, i) => {
      const nama = dummyNames[i % dummyNames.length];
      const umur = (18 + (i % 40)).toString();
      const pasal = pasalList[i % pasalList.length];
      const status = statusList[i % statusList.length];
      const lokasi = lokasiList[i % lokasiList.length];
      const tanggalKejadian = formatDate(i + 3);
      const tanggalLaporan = formatDate(i + 1);
      const petugas = petugasList[i % petugasList.length];

      return {
        no_laporan: `LP/2025/00${i + 1}`,
        pelapor: nama,
        terlapor: `Terlapor ${i}`,
        lokasi,
        tanggal_kejadian: tanggalKejadian,
        tanggal_laporan: tanggalLaporan,
        pasal,
        barang_bukti: `Barang bukti ${i}`,
        tersangka: `Tersangka ${i}`,
        perkembangan: [
          {
            tanggal_update: formatDate(i + 1),
            pic: petugas,
            keterangan: `Perkembangan awal laporan ke-${i}`,
          },
          {
            tanggal_update: formatDate(i),
            pic: petugasList[(i + 1) % petugasList.length],
            keterangan: `Tindak lanjut laporan ke-${i}`,
          }
        ],
        status,
        umur_pelapor: umur,
        singkat_kejadian: `Pelapor ${nama} mengalami kejadian pada ${lokasi}.`,
        alamat_pelapor: `${lokasi} No.${i + 10}`,
        petugas_penerima: petugas
      };
    });

    await LaporanPolisi.deleteMany();
    await LaporanPolisi.insertMany(data);
    console.log('✅ 30 data laporan polisi berhasil dimasukkan!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Gagal seeding:', err);
    mongoose.disconnect();
  }
};

seedLaporan();
