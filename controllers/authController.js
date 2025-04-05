import asyncHandler from 'express-async-handler';
import UserModel from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

const Register = asyncHandler(async (req, res) => {
	const { fullname, regno, email, password, password2 } = req.body;

	const upperReg = regno.toUpperCase();
	const lowerEmail = email.toLowerCase();

	if (!fullname || !regno || !email || !password || !password2) {
		res.status(401);
		throw new Error('All fields are required');
	}

	if (password !== password2) {
		res.status(401);
		throw new Error('Password does not match');
	}

	if (password.length < 6) {
		res.status(401);
		throw new Error('Password must be at least 6 characters ');
	}

	const userExists = await UserModel.findOne({ regno: upperReg });
	if (userExists) {
		res.status(401);
		throw new Error('User Already Exist ');
	}

	const user = await UserModel.create({
		fullname,
		regno: upperReg,
		email: lowerEmail,
		password,
	});

	generateToken(res, user._id);

	// Optionally, also send the token in the JSON response
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	// Send token in response
	res.status(201).json({
		message: 'User registered successfully',
		token,
		user: {
			id: user._id,
			fullname: user.fullname,
			email: user.email,
			regno: user.regno,
		},
	});
});

const Login = asyncHandler(async (req, res) => {
	const { regno, password } = req.body;
	const upperReg = regno.toUpperCase();

	if (!regno || !password) {
		res.status(401);
		throw new Error('Please Provide both Reg No and Password ');
	}

	const user = await UserModel.findOne({ regno: upperReg });

	if (!user) {
		res.status(401);
		throw new Error('Invalid Reg No or Password');
	}

	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid Reg No or Password ');
	}

	generateToken(res, user._id);

	// Optionally, also send the token in the JSON response
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(200).json({
		message: 'Login successful',
		token,
		user: {
			id: user._id,
			fullname: user.fullname,
			email: user.email,
			regno: upperReg,
		},
	});
});

const Logout = asyncHandler(async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		expires: new Date(0),
	});

	res.status(200).json({ message: 'Successfully logged out' });
});

export { Register, Login, Logout };
