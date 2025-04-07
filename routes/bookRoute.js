import express from 'express';
import upload from '../config/upload.js';
import { protect } from '../middlewares/authMiddleware.js';
import { AllBooks, DeleteBook, GetBook, UploadBook } from '../controllers/bookController.js';
const router = express.Router();

router.post('/add-book', protect, upload.single('pdf'), UploadBook);
router.get('/get-book', protect, GetBook);
router.get('/all-book', protect, AllBooks);
router.delete('/delete-book/:id', protect, DeleteBook);

export default router;
