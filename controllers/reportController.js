const Report = require('../models/reportModel');

// 🔧 Fungsi bantu: Tambah 7 jam
const adjustToWIB = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 7);
    return date;
};

// GET: List laporan (dengan pencarian & filter tanggal string)
exports.getLaporanList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.perPage || req.query.limit) || 10;
        const search = req.query.keyword || '';
        const skip = (page - 1) * size;

        const { tanggal_laporan, tanggal_kejadian } = req.query;

        const searchFields = [
            'no_laporan',
            'pelapor',
            'lokasi',
            'kejadian',
            'pasal',
            'saksi',
            'barang_bukti',
            'tersangka',
            'perkembangan.keterangan',
            'pic',
            'tanggal_update',
            'keterangan',
            'status'
        ];

        const searchQuery = {};

        // Keyword search
        if (search) {
            searchQuery.$or = searchFields.map((field) => ({
                [field]: { $regex: search, $options: 'i' },
            }));
        }

        // Tanggal filter pakai string prefix (regex)
        if (tanggal_laporan) {
            searchQuery.tanggal_laporan = { $regex: `^${tanggal_laporan}`, $options: 'i' };
        }

        if (tanggal_kejadian) {
            searchQuery.tanggal_kejadian = { $regex: `^${tanggal_kejadian}`, $options: 'i' };
        }

        const [laporanList, totalElements] = await Promise.all([
            Report.find(searchQuery).skip(skip).limit(size),
            Report.countDocuments(searchQuery),
        ]);

        const totalPages = Math.ceil(totalElements / size);

        res.status(200).json({
            data: {
                content: laporanList,
            },
            totalPages,
            totalElements,
            page,
            size,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Detail laporan by ID
exports.getLaporanDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const laporan = await Report.findById(id);

        if (!laporan) {
            return res.status(404).json({ error: 'Laporan not found' });
        }

        res.status(200).json({
            data: {
                content: laporan,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update laporan by ID
exports.updateLaporan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatePayload = { ...req.body };

        if (req.file) {
            updatePayload.images = req.file.filename;
        }

        // Penyesuaian tanggal jika ada
        if (updatePayload.tanggal_laporan) {
            updatePayload.tanggal_laporan = adjustToWIB(updatePayload.tanggal_laporan);
        }
        if (updatePayload.tanggal_kejadian) {
            updatePayload.tanggal_kejadian = adjustToWIB(updatePayload.tanggal_kejadian);
        }
        if (updatePayload.tanggal_update) {
            updatePayload.tanggal_update = adjustToWIB(updatePayload.tanggal_update);
        }

        const updated = await Report.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: 'Laporan not found' });
        }

        res.status(200).json({
            message: 'Laporan updated successfully',
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST: Create new laporan
exports.createLaporan = async (req, res) => {
    try {
        const {
            no_laporan,
            pelapor,
            lokasi,
            tanggal_kejadian,
            tanggal_laporan,
            petugas_penerima,
            pasal,
            saksi,
            barang_bukti,
            tersangka,
            perkembangan,
            pic,
            tanggal_update,
            keterangan,
            status,
            umur_pelapor,
            singkat_kejadian,
            alamat_pelapor,
        } = req.body;

        // Validasi wajib
        if (!no_laporan || !pelapor || !tanggal_laporan || !tanggal_kejadian) {
            return res.status(400).json({ message: 'Beberapa field wajib belum diisi.' });
        }

        // Cek duplikasi nomor laporan
        const exist = await Report.findOne({ no_laporan });
        if (exist) return res.status(400).json({ error: 'Nomor laporan sudah digunakan.' });

        // Buat laporan dengan penyesuaian waktu
        const laporan = await Report.create({
            no_laporan,
            pelapor,
            lokasi,
            tanggal_kejadian: adjustToWIB(tanggal_kejadian),
            tanggal_laporan: adjustToWIB(tanggal_laporan),
            petugas_penerima,
            pasal,
            saksi,
            barang_bukti,
            tersangka,
            perkembangan,
            pic,
            tanggal_update: tanggal_update ? adjustToWIB(tanggal_update) : undefined,
            keterangan,
            status,
            umur_pelapor,
            singkat_kejadian,
            alamat_pelapor,
        });

        res.status(201).json({
            message: 'Laporan berhasil dibuat.',
            data: laporan,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: Hapus laporan by ID
exports.deleteLaporanById = async (req, res) => {
    try {
        const { id } = req.body;

        const deleted = await Report.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Laporan not found' });
        }

        res.status(200).json({
            message: 'Laporan deleted successfully',
            data: deleted,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
