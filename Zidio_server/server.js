import express from 'express'; 
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js'; 
import adminRoutes from './routes/adminRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
// const uploadRoutes = require("./routes/upload"); // ✅ new

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use("/api", uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
