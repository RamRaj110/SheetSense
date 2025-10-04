import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getAllUsers, deleteUser, getUserAnalytics, getAdminStats, getUserDetails, deleteFile } from '../controllers/adminController.js';

const router = express.Router();


router.get('/users', adminAuth, getAllUsers);
router.delete('/users/:id', adminAuth, deleteUser);
router.get('/users/:id/analytics', adminAuth, getUserAnalytics);

// New admin dashboard endpoints
router.get('/stats', adminAuth, getAdminStats);
router.get('/users/:id/details', adminAuth, getUserDetails);
router.delete('/files/:id', adminAuth, deleteFile);

export default router;