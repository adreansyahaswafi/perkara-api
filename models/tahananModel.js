const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    nama_tahanan: {
        type: String,
        required: true,
        unique: true
    },
    umur: { type: String, required: true },
    jenis_kelamin: { type: String, required: true },
    perkara_pasal: { type: String, required: true },
    alamat: { type: String, required: false },
    no_laporan_polisi: { type: String, required: false },
    no_surat_penahanan: { type: String, required: false },
    no_surat_permintaan_perpanjang_tahanan: { type: String, required: false },
    no_surat_perintah_perpanjang_tahanan: { type: String, required: false },
    no_surat_perintah_penangguhan_tahanan: { type: String, required: false },
    no_surat_perintah_pengalihan_tahanan: { type: String, required: false },
    no_surat_perintah_pengeluaran_tahanan: { type: String, required: false },
    pasal_pidana: { type: String, required: false },
    tanggal_masuk: { type: String, required: false },
    tanggal_keluar: { type: String, required: false },
    keterangan: { type: String, required: false },
}, { timestamps: true });

reportSchema.pre('save', async function (next) {
    next();
})

const Tahanan = mongoose.model('tahanan', reportSchema);

module.exports = Tahanan;
