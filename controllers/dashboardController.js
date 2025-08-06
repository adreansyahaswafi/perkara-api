const LaporanPolisi = require('../models/reportModel');
const RegisterReport = require('../models/registerReportModel');
const Kejahatan = require('../models/dataAwalKejahatanModel');
const Tahanan = require('../models/tahananModel');
const Pustaka = require('../models/pustakaModel');

exports.getDashboardSummary = async (req, res) => {
    try {
        const [totalLaporanPolisi, totalRegisterLaporan, totalPustaka] = await Promise.all([
            LaporanPolisi.countDocuments(),
            RegisterReport.countDocuments(),
            Pustaka.countDocuments()
        ]);

        res.status(200).json({
            data: {
                total_laporan_polisi: totalLaporanPolisi,
                total_register_laporan: totalRegisterLaporan,
                total_pasal: totalPustaka
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
