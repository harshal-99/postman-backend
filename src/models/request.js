import {DataTypes, Model} from "sequelize";
import {sequelize} from "../utils/db.js";

class Request extends Model {
}

Request.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: '',
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: '',
	},
	body: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: '',
	}
}, {sequelize})

export default Request
