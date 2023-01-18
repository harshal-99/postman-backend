import {DataTypes, Model} from "sequelize";
import {sequelize} from "../utils/db.js";

class User extends Model {
}

User.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	}
}, {
	sequelize,
})

export default User
