const PustakaPasal = require('../models/pustakaModel');

// GET: List semua pustaka pasal (with pagination + search)
exports.getPustakaPasalList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || '';
    const skip = (page - 1) * size;

    const searchFields = ['nama_peraturan', 'jenis_peraturan', 'tahun_peraturan'];
    const searchQuery = keyword
      ? {
        $or: searchFields.map((field) => ({
          [field]: { $regex: keyword, $options: 'i' },
        })),
      }
      : {};

    const [items, totalElements] = await Promise.all([
      PustakaPasal.find(searchQuery).skip(skip).limit(size),
      PustakaPasal.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      data: { content: items },
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET: Detail pustaka pasal by ID
exports.getPustakaPasalDetail = async (req, res) => {
  try {
    const item = await PustakaPasal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.status(200).json({ data: { content: item } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST: Tambah pustaka pasal (dengan upload PDF)
exports.createPustakaPasal = async (req, res) => {
  try {
    const { nama_peraturan, jenis_peraturan, tahun_peraturan } = req.body;
    const link_pdf = req.file ? req.file.filename : null;

    if (!nama_peraturan || !jenis_peraturan || !tahun_peraturan) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const created = await PustakaPasal.create({
      nama_peraturan,
      jenis_peraturan,
      tahun_peraturan,
      link_pdf,
    });

    res.status(201).json({
      message: 'Data berhasil ditambahkan',
      data: created,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT: Update pustaka pasal (bisa update PDF juga)
exports.updatePustakaPasal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_peraturan, jenis_peraturan, tahun_peraturan } = req.body;

    const updatePayload = {
      nama_peraturan,
      jenis_peraturan,
      tahun_peraturan,
    };

    if (req.file) {
      updatePayload.link_pdf = req.file.filename;
    }

    const updated = await PustakaPasal.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.status(200).json({
      message: 'Data berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE: Hapus pustaka pasal
exports.deletePustakaPasal = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await PustakaPasal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.status(200).json({
      message: 'Data berhasil dihapus',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
