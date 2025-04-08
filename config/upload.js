import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'e-library-pdfs',
		resource_type: 'auto', // ✅ Change from 'raw' to 'auto'
		format: async (req, file) => 'pdf',
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			cb(new Error('Only PDF files are allowed!'), false);
		}
	},
});

export default upload;
