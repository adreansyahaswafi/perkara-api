const express = require('express');
const router = express.Router();
const {
   createPustakaPasal,
   deletePustakaPasal,
   getPustakaPasalDetail,
   getPustakaPasalList,
   updatePustakaPasal
} = require('../controllers/pustakaController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/pustaka-pasal', protect, getPustakaPasalList);
router.get('/pustaka-pasal/:id', protect, getPustakaPasalDetail);
router.post('/create-pustaka-pasal', upload.single('link_pdf'), createPustakaPasal);
router.post('/update-pustaka-pasal/:id', protect, upload.single('link_pdf'), updatePustakaPasal);
router.post('/delete-pustaka-pasal', protect, deletePustakaPasal);

module.exports = router;
