import express from 'express';
import {
	AllUsers,
	DeleteUser,
	Login,
	Logout,
	Register,
	UserDetails,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/get-details', protect, UserDetails);
router.get('/all-user', protect, AllUsers);

router.delete('/delete-user/:id', protect, DeleteUser);

export default router;
