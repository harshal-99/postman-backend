import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

export const PORT = process.env.PORT || 3005

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/postman'

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const configureDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		console.log('Connected to DB')
	} catch (e) {
		console.log('Error connecting to DB:', e.message)
	}
}
