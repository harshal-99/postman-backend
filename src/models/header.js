import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
	key: {
		type: String,
		defaultValue: '',
	},
	value: {
		type: String,
		defaultValue: '',
	},
	checked: {
		type: Boolean,
		defaultValue: false,
	}
})

headerSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Header = mongoose.model("Header", headerSchema)

export default Header
