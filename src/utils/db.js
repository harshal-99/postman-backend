import {Sequelize} from "sequelize"

export const sequelize = new Sequelize("test-db","user","pass",{
  dialect:"sqlite",
  host:"./config/db.sqlite",
});

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate()
		console.log('Connected to database')
	} catch (e) {
		console.log('failed to connect to database', e.name, e.message)
		process.exit(1)
	}
}
