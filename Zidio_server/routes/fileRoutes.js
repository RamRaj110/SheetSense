import express from 'express';
import { getFiles, deleteFile, downloadFile, getFileData } from '../controllers/fileController.js';
import { userAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Get all files for the authenticated user
router.get('/', userAuth, getFiles);

// Delete a specific file
router.delete('/:id', userAuth, deleteFile);

// Get file data for a specific file
router.get('/:id', userAuth, getFileData);

// Download a specific file
router.get('/:id/download', userAuth, downloadFile);

export default router;
