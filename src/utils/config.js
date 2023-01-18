import {config} from "dotenv"

config()

export const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
	throw new Error('Database URL is required')
}
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const PORT = process.env.PORT || 3005
