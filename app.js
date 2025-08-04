const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const registerLaporanRoutes = require('./routes/registerLaporanRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const dataAwalKejahatanRoutes = require('./routes/dataAwalKejahatanRoutes');
const tahananRoutes = require('./routes/tahananRoutes');

connectDB();

// ✅ Aktifkan CORS
app.use(cors({
  origin: '*', // <-- Ubah ke frontend URL untuk production
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', laporanRoutes);
app.use('/api/register-reports', registerLaporanRoutes);
app.use('/api/kejahatan', dataAwalKejahatanRoutes);
app.use('/api/tahanan', tahananRoutes);
app.use('/api/events', eventRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
