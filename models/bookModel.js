// models/BookModel.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
		description: { type: String, required: true },
		pdfUrl: { type: String, required: true }, // To store the PDF file path

		faculty: { type: String, required: true, default: 'FAMSSA' }, // Faculty name
		department: { type: String, required: true }, // Department name
		level: { type: Number, required: true, enum: [100, 200, 300, 400] }, // Level (100L, 200L, 300L, 400L)

		type: {
			type: String,
			required: true,
			enum: ['study-materials', 'past-question'], // Differentiating between study material and past question
		},
	},
	{
		timestamps: true,
	}
);

const BookModel = mongoose.model('BookModel', bookSchema);

export default BookModel;
