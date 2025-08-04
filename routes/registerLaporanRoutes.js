const express = require('express');
const router = express.Router();
const {
   deleteLaporanById,
   createLaporan,
   getLaporanDetail,
   getLaporanList,
   updateLaporan,
} = require('../controllers/registerReportController');
const protect = require('../middlewares/authMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/register-laporan-polisi', protect, getLaporanList);
router.get('/register-laporan-polisi/:id', protect, getLaporanDetail);
router.post('/create-register-laporan-polisi', protect, createLaporan);
router.post('/update-register-laporan-polisi/:id', protect, updateLaporan);
router.post('/delete-register-laporan-polisi', protect, deleteLaporanById);

module.exports = router;
