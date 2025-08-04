const express = require('express');
const router = express.Router();
const {
    login,
    updateUser,
    register,
    getMyProfile,
    changePasswordByEmail,
    logout,
    getUserList,
    getUserDetail,
    deleteUserById,
} = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ROUTES
router.get('/ping', (req, res) => res.send('Server OK'));

// ✅ Apply multer ONLY once here
router.get('/user-list', protect, getUserList);
router.get('/user-list/:id', protect, getUserDetail);
router.post('/register', protect, upload.single('images'), register);
router.post('/update-user/:id', protect, upload.single('images'), updateUser);
router.post('/delete-user', protect, deleteUserById);


// Authenticated routes
router.get('/me', protect, getMyProfile);
router.post('/logout', protect, logout);
router.post('/login', login);
router.post('/change-password', changePasswordByEmail);

module.exports = router;
