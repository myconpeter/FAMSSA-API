import User from '../model/UserModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const protect = asyncHandler(async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		// console.log('Authorization Header:', JSON.stringify(authHeader)); // Debugging

		if (!authHeader || !authHeader.trim().startsWith('Bearer ')) {
			// console.log('i am ur problem', JSON.stringify(authHeader)); // More precise debugging
			return res.status(401).json({ message: 'No token, authorization denied' });
		}

		const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
		// console.log('Extracted Token:', token); // Debugging

		// Verify token
		// console.log(token);
		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) {
				console.error('JWT Verification Error:', err);
				return res.status(403).json({ message: 'Invalid or expired token' });
			}

			// Attach user data to the request
			req.user = decoded;
			// console.log('req.user:', req.user);
			next();
		});
	} catch (error) {
		console.error('Protect Middleware Error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
});

export { protect };
