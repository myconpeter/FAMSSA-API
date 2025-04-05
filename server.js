import express from 'express';
import dotenv from 'dotenv';
import CONNECT_DB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFount } from './middlewares/errorMiddeware.js';
import userRoutes from './routes/authRoute.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'https://famssa-elibrary.onrender.com'];

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl)
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'working',
	});
});

app.use('/api/auth', userRoutes);
app.use(errorHandler);

app.use(notFount);

app.listen(PORT, async () => {
	await CONNECT_DB();
	console.log(`Server is running on port ${PORT}`);
});
