const express = require('express');
const router = express.Router();
const {
    createTahanan,
    deleteTahananById,
    getTahananDetail,
    getTahananList,
    updateTahanan
} = require('../controllers/tahananController');
const protect = require('../middlewares/authMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/register-tahanan', protect, getTahananList);
router.get('/register-tahanan/:id', protect, getTahananDetail);
router.post('/create-register-tahanan', protect, createTahanan);
router.post('/update-register-tahanan/:id', protect, updateTahanan);
router.post('/delete-register-tahanan', protect, deleteTahananById);

module.exports = router;
