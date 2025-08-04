const LaporanPolisi = require('../models/reportModel');
const RegisterReport = require('../models/registerReportModel');
const Kejahatan = require('../models/dataAwalKejahatanModel');
const Tahanan = require('../models/tahananModel');

exports.getDashboardSummary = async (req, res) => {
    try {
        const [totalLaporanPolisi, totalRegisterLaporan, totalKejahatan, totalTahanan] = await Promise.all([
            LaporanPolisi.countDocuments(),
            RegisterReport.countDocuments(),
            Kejahatan.countDocuments(),
            Tahanan.countDocuments()
        ]);

        res.status(200).json({
            data: {
                total_laporan_polisi: totalLaporanPolisi,
                total_register_laporan: totalRegisterLaporan,
                total_kejahatan: totalKejahatan,
                total_tahanan: totalTahanan
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
