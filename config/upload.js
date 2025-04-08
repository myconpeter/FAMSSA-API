import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'e-library-pdfs',
		resource_type: 'raw',
		format: async (req, file) => 'pdf',
		public_id: (req, file) => `${Date.now()}-${file.originalname}`,
		access_mode: 'public', // ✅ make it publicly accessible
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
