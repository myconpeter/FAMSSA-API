// config/upload.js
import multer from 'multer';

// Define storage settings
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Specify the folder to store PDFs
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname); // Unique file name
	},
});

// Create multer upload middleware
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		// Only allow PDF files
		if (file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			cb(new Error('Only PDF files are allowed!'), false);
		}
	},
});

export default upload;
