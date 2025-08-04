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
    tanggal_laporan: { type: String, required: true },
    pasal: { type: String, required: true },
    tersangka: { type: String, required: true },
    keterangan: { type: String, required: true },
    umur_pelapor: { type: String, required: true },
    singkat_kejadian: { type: String, required: true },
    alamat_pelapor: { type: String, required: false },
    jenis_kelamin: { type: String, required: false },
}, { timestamps: true });

reportSchema.pre('save', async function (next) {
    next();
})

const RegisterReport = mongoose.model('register_reports', reportSchema);

module.exports = RegisterReport;
