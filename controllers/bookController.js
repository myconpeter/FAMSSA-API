import BookModel from '../models/bookModel.js';

import asyncHandler from 'express-async-handler'; // Import asyncHandler
import UserModel from '../models/userModel.js';

import fs from 'fs';
import path from 'path';
import cloudinary from '../utils/cloudinary.js'; // Make sure this import exists


const UploadBook = asyncHandler(async (req, res) => {
	// console.log(req.user)
	// console.log('we are here');

	// console.log(req.body);
	const { title, author, description, department, level, type } = req.body;
	const pdfUrl = req.file.path; // 📦 Cloudinary returns full URL
 // Path to the PDF file

	if (!title || !author || !description || !department || !level || !type) {
		res.status(401);
		throw new Error('All fields are required');
	}

	// Create a new book document with the department and level information
	const newBook = new BookModel({
		title,
		author,
		description,
		pdfUrl,
		department,
		level,
		type,
	});

	// Save the book to the database
	await newBook.save();

	res.status(201).json({
		message: 'Book uploaded successfully',
		book: newBook,
	});
});

const GetBook = asyncHandler(async (req, res) => {
	// console.log(req.user);
	// console.log('we are here');

	// console.log('body', req.body);
	// console.log('params', req.query);
	const { department, level, type } = req.query; // Get query parameters

	console.log(department, level, type);

	// Validate the presence of required parameters
	if (!department || !level || !type) {
		return res.status(400).json({ message: 'Missing required parameters' });
	}

	try {
		const books = await BookModel.find({
			department,
			level,
			type,
		});

		// if (books.length === 0) {
		// 	return res.status(404).json({ message: 'No books found' });
		// }

		res.status(200).json(books); // Send the fetched books in the response
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch books', error: err.message });
	}
});

const AllBooks = asyncHandler(async (req, res) => {
	if (!req.user) {
		res.status(403);
		throw new Error('Access denied.');
	}

	const user = await UserModel.findOne({ _id: req.user.userId }).select('-password');

	if (!user.isAdmin) {
		res.status(403);
		throw new Error('Access denied.');
	}

	const books = await BookModel.find();

	res.status(200).json(books);
});


const DeleteBook = asyncHandler(async (req, res) => {
	if (!req.user) {
		res.status(403);
		throw new Error('Access denied.');
	}

	const user = await UserModel.findOne({ _id: req.user.userId }).select('-password');

	if (!user.isAdmin) {
		res.status(403);
		throw new Error('Access denied.');
	}

	const theBook = await BookModel.findById(req.params.id);
	if (!theBook) {
		res.status(404);
		throw new Error('Book not found');
	}

	const bookUrl = theBook.pdfUrl;

	// ✅ Extract the public ID from the Cloudinary URL
	const publicId = bookUrl.split('/').pop().split('.')[0]; // e.g., '17123456789-filename'

	try {
		await cloudinary.uploader.destroy(`e-library-pdfs/${publicId}`, { resource_type: 'raw' });
		console.log('PDF deleted from Cloudinary');
	} catch (err) {
		console.error('Cloudinary deletion error:', err.message);
	}

	await BookModel.findByIdAndDelete(req.params.id);

	res.status(200).json({ message: 'Book deleted successfully' });
});

export { UploadBook, GetBook, AllBooks, DeleteBook };
