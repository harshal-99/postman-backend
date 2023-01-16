import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
	url: {
		type: String,
		defaultValue: '',
	},
	type: {
		type: String,
		defaultValue: '',
	},
	body: {
		type: String,
		defaultValue: '',
	},
	headers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Header"
		}
	],
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
})

requestSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Request = mongoose.model('Request', requestSchema)

export default Request
