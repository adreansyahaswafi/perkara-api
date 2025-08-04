const RegisterReport = require('../models/dataAwalKejahatanModel');

// GET: List data awal kejahatan (pagination + search)
exports.dataAwalKejahatanList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || '';
    const skip = (page - 1) * size;

    const searchFields = [
      "no_laporan",
      "tanggal_laporan",
      "tanggal_pidana",
      "singkat_kejadian",
      "taksiran_kerugian",
      "detail_pelapor"
    ];

    const searchQuery = keyword
      ? {
        $or: searchFields.map((field) => ({
          [field]: { $regex: keyword, $options: 'i' },
        })),
      }
      : {};

    const [laporanList, totalElements] = await Promise.all([
      RegisterReport.find(searchQuery).skip(skip).limit(size),
      RegisterReport.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      data: {
        content: laporanList,
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

// GET: Detail data awal kejahatan by ID
exports.getDataAwalKejahatanDetail = async (req, res) => {
  try {
    const laporan = await RegisterReport.findById(req.params.id);
    if (!laporan) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

    res.status(200).json({
      data: {
        content: laporan,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: Buat data awal kejahatan
exports.createDataAwalKejahatan = async (req, res) => {
  try {
    const {
      no_laporan,
      tanggal_laporan,
      tanggal_pidana,
      singkat_kejadian,
      taksiran_kerugian,
      detail_pelapor,
    } = req.body;

    if (!no_laporan || !tanggal_laporan || !tanggal_pidana || !singkat_kejadian || !taksiran_kerugian || !detail_pelapor) {
      return res.status(400).json({ message: 'Beberapa field wajib belum diisi.' });
    }

    const existing = await RegisterReport.findOne({ no_laporan });
    if (existing) return res.status(400).json({ error: 'Nomor laporan sudah digunakan.' });

    const laporan = await RegisterReport.create({
      no_laporan,
      tanggal_laporan,
      tanggal_pidana,
      singkat_kejadian,
      taksiran_kerugian,
      detail_pelapor,
    });

    res.status(201).json({
      message: 'Data awal kejahatan berhasil dibuat.',
      data: laporan,
    });
  } catch (error) {
    console.error('❌ Gagal membuat data awal kejahatan:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update data awal kejahatan
exports.updateDataAwalKejahatan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };
    console.log(req.body)

    const updated = await RegisterReport.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.status(200).json({
      message: 'Data awal kejahatan berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE: Hapus data awal kejahatan
exports.deleteDataAwalKejahatanById = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await RegisterReport.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.status(200).json({
      message: 'Data awal kejahatan berhasil dihapus',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
