const mongoose = require('mongoose');
const LaporanPolisi = require('./models/reportModel'); // Ganti path kalau beda

mongoose.connect('mongodb://127.0.0.1:27018/perkara', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const dummyNames = ["Andi", "Budi", "Santi", "Joko", "Nia", "Rudi", "Tini", "Eko", "Lina"];
const lokasiList = ["Jl. Merdeka", "Jl. Sudirman", "Jl. Gajah Mada"];
const pasalList = ["Pasal 362 KUHP", "Pasal 351 KUHP", "Pasal 378 KUHP"];
const statusList = ["proses", "selesai", "sidang"];
const petugasList = ["Briptu Ardi", "Aiptu Dedi", "Iptu Rika"];

const randomDateStr = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString();

const seedLaporan = async () => {
  try {
    const data = Array.from({ length: 30 }).map((_, i) => {
      const nama = dummyNames[i % dummyNames.length];
      const umur = (18 + (i % 40)).toString();
      const pasal = pasalList[i % pasalList.length];
      const status = statusList[i % statusList.length];
      const lokasi = lokasiList[i % lokasiList.length];
      const tanggalKejadian = randomDateStr(i + 3);
      const tanggalLaporan = randomDateStr(i + 1);
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
        perkembangan: `Tahap ${i % 3} - Catatan perkembangan laporan ke-${i}`,
        pic: `Nama: ${petugas}, Pangkat: Briptu`,
        tanggal_update: new Date().toISOString(),
        keterangan: `Keterangan untuk laporan ke-${i}`,
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
