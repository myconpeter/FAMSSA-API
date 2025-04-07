import express from 'express';
import dotenv from 'dotenv';
import CONNECT_DB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFount } from './middlewares/errorMiddeware.js';
import userRoutes from './routes/authRoute.js';
import bookRoutes from './routes/bookRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // Get current file's URL
const __dirname = path.dirname(__filename); // Get the directory name of the current file
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use(
	cors({
		origin: '*', // Your frontend origin
		credentials: true, // Allow cookies and credentials
	})
);

app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'working',
	});
});

app.use('/api/auth', userRoutes);
app.use('/api/book', bookRoutes);
app.use(errorHandler);

app.use(notFount);

app.listen(PORT, async () => {
	await CONNECT_DB();
	console.log(`Server is running on port ${PORT}`);
});
