const RegisterReport = require('../models/registerReportModel');

// GET: List laporan (pagination + search)
exports.getLaporanList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || '';
    const skip = (page - 1) * size;

    const searchFields = [
      "no_laporan",
      "pelapor",
      "jenis_kelamin",
      "umur_pelapor",
      "alamat_pelapor",
      "singkat_kejadian",
      "pasal",
      "tanggal_laporan",
      "tersangka",
      "keterangan"
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

// GET: Detail laporan by ID
exports.getLaporanDetail = async (req, res) => {
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

// POST: Buat laporan baru
exports.createLaporan = async (req, res) => {
  try {
    const {
      no_laporan,
      pelapor,
      jenis_kelamin,
      tanggal_laporan,
      pasal,
      tersangka,
      keterangan,
      umur_pelapor,
      singkat_kejadian,
      alamat_pelapor,
    } = req.body;
    // Validasi field wajib
    if (
      !no_laporan || !pelapor || !tanggal_laporan || !pasal || !tersangka ||
      !keterangan || !umur_pelapor || !singkat_kejadian
    ) {
      return res.status(400).json({ message: 'Beberapa field wajib belum diisi.' });
    }

    // Cek duplikat nomor laporan
    const existing = await RegisterReport.findOne({ no_laporan });
    if (existing) return res.status(400).json({ error: 'Nomor laporan sudah digunakan.' });

    const laporan = await RegisterReport.create({
      no_laporan,
      jenis_kelamin,
      pelapor,
      tanggal_laporan,
      pasal,
      tersangka,
      keterangan,
      umur_pelapor,
      singkat_kejadian,
      alamat_pelapor,
    });

    res.status(201).json({
      message: 'Laporan berhasil dibuat.',
      data: laporan,
    });
  } catch (error) {
    // console.error('❌ Gagal membuat laporan:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update laporan
exports.updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    const updated = await RegisterReport.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    res.status(200).json({
      message: 'Laporan berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE: Hapus laporan
exports.deleteLaporanById = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await RegisterReport.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    res.status(200).json({
      message: 'Laporan berhasil dihapus',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
