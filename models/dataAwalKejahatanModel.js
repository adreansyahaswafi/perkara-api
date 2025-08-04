const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    no_laporan: {
        type: String,
        required: true,
        unique: true
    },
    tanggal_laporan: { type: String, required: true },
    tanggal_pidana: { type: String, required: true },
    singkat_kejadian: { type: String, required: true },
    taksiran_kerugian: { type: String, required: true },
    alamat_pelapor: { type: String, required: false },
    detail_pelapor: { type: String, required: false },
    tersangka: { type: Object, required: false },
    berkas_perkara: { type: Object, required: false },
    putusan_hakim: { type: Object, required: false },
    pasal: { type: Object, required: false },
    data_lain: { type: Object, required: false },
}, { timestamps: true });

reportSchema.pre('save', async function (next) {
    next();
})

const DataAwal = mongoose.model('data_awal_kejahatan', reportSchema);

module.exports = DataAwal;
