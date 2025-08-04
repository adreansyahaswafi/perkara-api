const express = require('express');
const router = express.Router();
const {
   createDataAwalKejahatan,
   dataAwalKejahatanList,
   deleteDataAwalKejahatanById,
   getDataAwalKejahatanDetail,
   updateDataAwalKejahatan
} = require('../controllers/dataAwalKejahatanController');
const protect = require('../middlewares/authMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/data-awal-kejahatan', protect, dataAwalKejahatanList);
router.get('/data-awal-kejahatan/:id', protect, getDataAwalKejahatanDetail);
router.post('/create-data-awal-kejahatan', protect, createDataAwalKejahatan);
router.post('/update-data-awal-kejahatan/:id', protect, updateDataAwalKejahatan);
router.post('/delete-data-awal-kejahatan', protect, deleteDataAwalKejahatanById);

module.exports = router;
