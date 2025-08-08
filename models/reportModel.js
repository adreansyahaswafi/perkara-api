const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    no_laporan: {
        type: String,
        required: true,
        unique: true
    },
    pelapor: {
        type: String,
        required: true,
    },
    terlapor: { type: String, required: false },
    lokasi: { type: String, required: true },
    tanggal_kejadian: { type: String, required: true },
    tanggal_laporan: { type: String, required: true },
    pasal: { type: String, required: true },
    barang_bukti: { type: String, required: true },
    tersangka: { type: String, required: true },
    perkembangan: { type: Array, required: true },
    status: { type: String, required: true },
    umur_pelapor: { type: String, required: true },
    singkat_kejadian: { type: String, required: true },
    alamat_pelapor: { type: String, required: false },
    petugas_penerima: { type: String, required: false },
}, { timestamps: true });

reportSchema.pre('save', async function (next) {
    next();
})

const Report = mongoose.model('reports', reportSchema);

module.exports = Report;
