import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const userAuth = async (req, res, next) => {
    try {
        // Get token from header
        let token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token && req.query.token) {
            token = req.query.token;
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};
