const express = require('express');
const router = express.Router();
const {
    updateLaporan,
    getLaporanList,
    getLaporanDetail,
    deleteLaporanById,
    createLaporan,
} = require('../controllers/reportController');
const protect = require('../middlewares/authMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/laporan-polisi', protect, getLaporanList);
router.get('/laporan-polisi/:id', protect, getLaporanDetail);
router.post('/create-laporan-polisi', protect, createLaporan);
router.post('/update-laporan-polisi/:id', protect, updateLaporan);
router.post('/delete-laporan-polisi', protect, deleteLaporanById);

module.exports = router;
