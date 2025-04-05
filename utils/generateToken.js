import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '30d', // JWT expiration (30 days)
	});

	// Set the cookie with JWT token
	res.cookie('jwt', token, {
		httpOnly: true, // Ensures cookie is not accessible via JavaScript
		secure: process.env.NODE_ENV !== 'local', // Set to true in production (requires HTTPS)
		sameSite: 'strict', // Helps mitigate CSRF attacks
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Cookie expiration (30 days)
	});
};

export default generateToken;
