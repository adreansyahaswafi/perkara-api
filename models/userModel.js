const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    images: { type: String, required: false },
    password: { type: String, required: true },
    jabatan: { type: String, required: true },
    level: { type: String, required: true },
    phone: { type: String, required: true },
    createdDate: { type: String, required: true },
    access_token: { type: String, required: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model('users', userSchema);

module.exports = User;
