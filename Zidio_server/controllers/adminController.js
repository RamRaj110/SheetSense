import User from '../models/User.js';
import File from '../models/File.js';
// Dashboard stats endpoint
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    // For demo, totalAnalytics is just totalFiles (replace with real analytics count if available)
    const totalAnalytics = totalFiles;
    res.json({ totalUsers, totalFiles, totalAnalytics });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// User details endpoint
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('files');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const filesCount = user.files.length;
    const storageUsed = user.files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
    const lastActive = user.lastActive || user.updatedAt || user.createdAt;
    const recentFiles = user.files.slice(-5).map(f => ({
      _id: f._id,
      name: f.name,
      fileSize: f.fileSize,
      uploadedAt: f.uploadedAt
    }));
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      filesCount,
      storageUsed,
      lastActive,
      recentFiles
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

// File delete endpoint
export const deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password')
      .populate('files')
      .exec();
    
    const usersWithFileCount = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      filesCount: user.files?.length || 0,
      createdAt: user.createdAt
    }));

    res.json(usersWithFileCount);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('files');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Failed to fetch user analytics' });
  }
};