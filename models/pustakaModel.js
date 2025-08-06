const mongoose = require('mongoose');

const pasalSchema = new mongoose.Schema({
    nama_peraturan: {
        type: String,
        required: true,
    },
    jenis_peraturan: {
        type: String,
        required: true,
    },
    tahun_peraturan: {
        type: String,
        required: true,
    },
    link_pdf: {
        type: String,
         required: false,
    }, // ➕ PDF link opsional
}, { timestamps: true });

const PustakaPasal = mongoose.model('pustaka_pasal', pasalSchema);

module.exports = PustakaPasal;
