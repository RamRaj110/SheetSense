import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { userAuth } from '../middleware/userAuth.js';
import File from '../models/File.js';
import User from '../models/User.js';

const router = express.Router();

// Updated MIME types to include PDF
const allowedMimes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'text/csv', // csv
  'application/pdf' // pdf
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel, CSV, and PDF files are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB
  },
  fileFilter
});

router.post("/upload", userAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    let type = 'excel';
    let data = [];
    let rowCount = 0;

    if (req.file.mimetype === 'application/pdf') {
      type = 'pdf';
    } else {
      // For Excel/CSV files, parse the data
      const workbook = xlsx.readFile(req.file.path);
      
      if (!workbook.SheetNames.length) {
        return res.status(400).json({
          success: false,
          message: "Excel file has no sheets"
        });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(sheet);
      rowCount = data.length;

      if (!data.length) {
        return res.status(400).json({
          success: false,
          message: "Excel file is empty"
        });
      }
    }

    // Create new File document
    const file = new File({
      name: req.file.originalname,
      diskFileName: req.file.filename,
      type: type,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      data: data,
      rowCount: rowCount
    });

    // Save to database
    await file.save();

    // Add file reference to user
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { files: file._id } }
    );

    const fileInfo = {
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: file.uploadedAt,
      rowCount: rowCount,
      type: type,
      id: file._id
    };

    res.json({ 
      success: true, 
      message: "File uploaded and data stored successfully",
      fileInfo,
      data: type === 'excel' ? data : [] 
    });

  } catch (err) {
    console.error('Upload error:', err);
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 10MB limit"
        });
      }
    }

    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to process file" 
    });
  }
});

export default router;