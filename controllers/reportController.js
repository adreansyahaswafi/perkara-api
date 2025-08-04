const Report = require('../models/reportModel');

// GET: List laporan dengan pagination dan search
exports.getLaporanList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.limit) || 10;
        const search = req.query.keyword || '';
        const skip = (page - 1) * size;

        const searchFields = [
            'no_laporan',
            'pelapor',
            'lokasi',
            'kejadian',
            'pasal',
            'barang_bukti',
            'tersangka',
            'perkembangan',
            'keterangan',
            'status'
        ];

        const searchQuery = search
            ? {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' },
                })),
            }
            : {};

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
            barang_bukti,
            tersangka,
            perkembangan,
            keterangan,
            status,
            umur_pelapor,
            singkat_kejadian,
            alamat_pelapor,
        } = req.body;

        // 🚫 Validasi wajib
        if (!no_laporan || !pelapor || !tanggal_laporan || !tanggal_kejadian) {
            return res.status(400).json({ message: 'Beberapa field wajib belum diisi.' });
        }

        // 🔍 Cek duplikasi nomor laporan
        const exist = await Report.findOne({ no_laporan });
        if (exist) return res.status(400).json({ error: 'Nomor laporan sudah digunakan.' });

        // ✅ Buat laporan
        const laporan = await Report.create({
            no_laporan,
            pelapor,
            lokasi,
            tanggal_kejadian,
            tanggal_laporan,
            petugas_penerima,
            pasal,
            barang_bukti,
            tersangka,
            perkembangan,
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
        console.error('❌ Create laporan failed:', err);
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
