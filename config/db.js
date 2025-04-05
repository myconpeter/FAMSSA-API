import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

let MONGO_URL = '';

if (process.env.NODE_ENV === 'dev') {
	console.log('Running in dev Environment');
	MONGO_URL = process.env.MONGO_DEV_URI;
} else if (process.env.NODE_ENV === 'production') {
	console.log('Running in production Environment');
	MONGO_URL = process.env.MONGO_PROD_URI;
} else {
	console.log('Environment not set correctly......');
}

const CONNECT_DB = async () => {
	try {
		mongoose.connect(MONGO_URL);
		console.log(`connected to database ${MONGO_URL}`);
	} catch (error) {
		console.error(`error occurred ${error}`);
		process.exit(1);
	}
};

export default CONNECT_DB;
