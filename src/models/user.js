import uniqueValidator from 'mongoose-unique-validator'
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		minlength: 3,
		required: true
	},
	passwordHash: {
		type: String, required: true
	}
})

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

export default User
