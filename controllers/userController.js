const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const User = require('../models/userModel');

exports.getUserList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.limit) || 10;
        const search = req.query.keyword || "";

        const skip = (page - 1) * size;

        // Fields to be searched (modify as needed)
        const searchFields = ['name', 'email', 'phone', 'jabatan'];

        const searchQuery = search
            ? {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' }, // case-insensitive
                })),
            }
            : {};

        const [users, totalElements] = await Promise.all([
            User.find(searchQuery)
                .select('-password')
                .skip(skip)
                .limit(size),
            User.countDocuments(searchQuery),
        ]);

        const totalPages = Math.ceil(totalElements / size);

        res.status(200).json({
            data: {
                content: users,
            },
            totalPages,
            totalElements,
            page,
            size,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            data: {
                content: user,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, jabatan, phone, terdaftar, level } = req.body;

    try {
        const updatePayload = {
            name,
            email,
            jabatan,
            phone,
            level,
            terdaftar,
        };

        // 🔐 Hash password jika diisi
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatePayload.password = await bcrypt.hash(password, salt);
        }

        // 🖼️ Jika ada file image diupload
        if (req.file) {
            updatePayload.images = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        }).select('-password'); // jangan kirim password ke client

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.register = async (req, res) => {
    try {
        const { name, email, password, jabatan, phone, createdDate, level } = req.body;

        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ error: 'Email already used' });

        const imageFile = req.file ? req.file.filename : null;

        const user = await User.create({
            name,
            email,
            password,
            jabatan,
            phone,
            level,
            createdDate,
            images: imageFile,
            access_token: '',
        });

        const token = generateToken(user);

        res.status(201).json({
            user: { id: user._id, name: user.name },
            access_token: token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        await User.updateOne(
            { email },
            { $set: { access_token: token } }
        );

        res.json({
            data: {
                id: user._id,
                name: user.name,
                access_token: token
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.body;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        // console.error('Delete failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        res.json({
            data: req.user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const email = req.user?.email;

        if (!email) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        // Clear the token field based on email
        await User.findOneAndUpdate(
            { email },
            { $set: { access_token: "" } }
        );

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePasswordByEmail = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.password = newPassword;
        await User.updateOne(
            { email: req.email },
            { $set: { access_token: '' } }
        );

        await user.save();

        res.json({
            data: {
                message: 'Password berhasil diubah'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};