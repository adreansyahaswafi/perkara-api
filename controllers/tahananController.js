const Tahanan = require('../models/tahananModel');

// GET: List tahanan (pagination + search)
exports.getTahananList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.limit) || 10;
        const keyword = req.query.keyword || '';
        const skip = (page - 1) * size;

        const searchFields = [
            "jenis_kelamin",
            "perkara_pasal",
            "alamat",
            "no_laporan_polisi",
            "no_surat_penahanan",
            "no_surat_permintaan_perpanjang_tahanan",
            "no_surat_perintah_perpanjang_tahanan",
            "no_surat_perintah_penangguhan_tahanan",
            "no_surat_perintah_pengalihan_tahanan",
            "no_surat_perintah_pengeluaran_tahanan",
            "pasal_pidana",
        ];

        const searchQuery = keyword
            ? {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: keyword, $options: 'i' },
                })),
            }
            : {};

        const [tahananList, totalElements] = await Promise.all([
            Tahanan.find(searchQuery).skip(skip).limit(size),
            Tahanan.countDocuments(searchQuery),
        ]);

        res.status(200).json({
            data: {
                content: tahananList,
            },
            page,
            size,
            totalElements,
            totalPages: Math.ceil(totalElements / size),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Detail tahanan by ID
exports.getTahananDetail = async (req, res) => {
    try {
        const tahanan = await Tahanan.findById(req.params.id);
        if (!tahanan) return res.status(404).json({ error: 'Tahanan tidak ditemukan' });

        res.status(200).json({
            data: {
                content: tahanan,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Buat data tahanan baru
exports.createTahanan = async (req, res) => {
    try {
        const {
            nama_tahanan,
            umur,
            jenis_kelamin,
            perkara_pasal,
            alamat,
            no_laporan_polisi,
            no_surat_penahanan,
            no_surat_permintaan_perpanjang_tahanan,
            no_surat_perintah_perpanjang_tahanan,
            no_surat_perintah_penangguhan_tahanan,
            no_surat_perintah_pengalihan_tahanan,
            no_surat_perintah_pengeluaran_tahanan,
            pasal_pidana,
            tanggal_masuk,
            tanggal_keluar,
            keterangan,
        } = req.body;

        if (!nama_tahanan || !umur || !jenis_kelamin || !perkara_pasal) {
            return res.status(400).json({ message: 'Field wajib belum diisi.' });
        }

        const existing = await Tahanan.findOne({ nama_tahanan });
        if (existing) return res.status(400).json({ error: 'Nama tahanan sudah digunakan.' });

        const newTahanan = await Tahanan.create({
            nama_tahanan,
            umur,
            jenis_kelamin,
            perkara_pasal,
            alamat,
            no_laporan_polisi,
            no_surat_penahanan,
            no_surat_permintaan_perpanjang_tahanan,
            no_surat_perintah_perpanjang_tahanan,
            no_surat_perintah_penangguhan_tahanan,
            no_surat_perintah_pengalihan_tahanan,
            no_surat_perintah_pengeluaran_tahanan,
            pasal_pidana,
            tanggal_masuk,
            tanggal_keluar,
            keterangan,
        });

        res.status(201).json({
            message: 'Data tahanan berhasil dibuat.',
            data: newTahanan,
        });
    } catch (error) {
        console.error('❌ Gagal membuat data tahanan:', error);
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update data tahanan
exports.updateTahanan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatePayload = { ...req.body };

        const updated = await Tahanan.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).json({ message: 'Data tahanan tidak ditemukan' });

        res.status(200).json({
            message: 'Data tahanan berhasil diperbarui',
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE: Hapus data tahanan
exports.deleteTahananById = async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await Tahanan.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: 'Data tahanan tidak ditemukan' });

        res.status(200).json({
            message: 'Data tahanan berhasil dihapus',
            data: deleted,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
