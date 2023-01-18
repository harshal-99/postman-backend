import {Sequelize} from "sequelize"
import {DATABASE_URL} from "./config.js";

export const sequelize = new Sequelize(DATABASE_URL, {
	logging: console.log
})

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate()
		console.log('Connected to database')
	} catch (e) {
		console.log('failed to connect to database', e.name, e.message)
		process.exit(1)
	}
}
