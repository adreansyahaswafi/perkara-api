const mongoose = require('mongoose');
const Tahanan = require('./models/tahananModel'); // Ganti path jika berbeda

mongoose.connect('mongodb://127.0.0.1:27017/perkara', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const dummyNames = [
  "Andi", "Budi", "Santi", "Joko", "Nia", "Rudi", "Tini", "Eko", "Lina",
  "Agus", "Rani", "Udin", "Dina", "Farhan", "Siska", "Taufik", "Dewi", "Irfan", "Nina"
];

const alamatList = [
  "Jl. Merdeka No.10", "Jl. Sudirman No.25", "Jl. Gajah Mada No.12",
  "Jl. Diponegoro No.7", "Jl. Thamrin No.5", "Jl. Asia Afrika No.88"
];

const pasalList = [
  "Pasal 362 KUHP", "Pasal 351 KUHP", "Pasal 378 KUHP", "Pasal 340 KUHP"
];

const jenisKelaminList = ["laki-laki", "perempuan"];

const randomDateStr = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const seedTahanan = async () => {
  try {
    const data = Array.from({ length: 50 }).map((_, index) => {
      const nama = `${dummyNames[index % dummyNames.length]} ${index}`;
      const umur = (18 + (index % 40)).toString();
      const jk = jenisKelaminList[index % 2];
      const alamat = alamatList[index % alamatList.length];
      const pasal = pasalList[index % pasalList.length];
      const tanggalMasuk = randomDateStr(index + 1);
      const tanggalKeluar = randomDateStr(index);

      return {
        nama_tahanan: nama,
        umur,
        jenis_kelamin: jk,
        perkara_pasal: pasal,
        alamat,
        no_laporan_polisi: `LP/2025/000${index + 1}`,
        no_surat_penahanan: `NSP-${index + 1}`,
        no_surat_permintaan_perpanjang_tahanan: `PMPT-${index + 100}`,
        no_surat_perintah_perpanjang_tahanan: `PPT-${index + 200}`,
        no_surat_perintah_penangguhan_tahanan: `PTT-${index + 300}`,
        no_surat_perintah_pengalihan_tahanan: `PGA-${index + 400}`,
        no_surat_perintah_pengeluaran_tahanan: `PKT-${index + 500}`,
        pasal_pidana: pasal,
        tanggal_masuk: tanggalMasuk,
        tanggal_keluar: tanggalKeluar,
        keterangan: "Tahanan belum disidangkan"
      };
    });

    await Tahanan.deleteMany(); // Optional: clear data before seeding
    await Tahanan.insertMany(data);
    console.log('✅ 50 data tahanan inserted!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error inserting tahanan:', err);
    mongoose.disconnect();
  }
};

seedTahanan();
