import File from '../models/File.js';
import fs from 'fs/promises';
import path from 'path';

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id })
      .select('-data')
      .sort({ uploadedAt: -1 });
    
    res.json({
      success: true,
      files: files.map(file => ({
        id: file._id,
        name: file.name,
        type: file.type,
        size: file.fileSize,
        uploadDate: file.uploadedAt,
        rowCount: file.rowCount || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files'
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    console.log("Deleting file with ID:", req.params.id);
    console.log("User ID:", req.user._id);

    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file from filesystem
    const filePath = path.join('uploads', file.diskFileName);
    await fs.unlink(filePath).catch(() => {});

    // Delete from database
    await file.deleteOne();
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
};

export const getFileData = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file: {
        id: file._id,
        name: file.name,
        type: file.type,
        size: file.fileSize,
        uploadDate: file.uploadedAt,
        rowCount: file.rowCount || 0,
        data: file.data || []
      }
    });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file data'
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const filePath = path.join('uploads', file.diskFileName);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk'
      });
    }

    res.download(filePath, file.name);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
};