import Header from "./header.js";
import Request from "./request.js";
import User from "./user.js";

User.hasMany(Request)
Request.belongsTo(User)

Request.hasMany(Header)
Header.belongsTo(Request)

await Promise.all([
	User.sync({alter: true}),
	Request.sync({alter: true}),
	Header.sync({alter: true})
])

export {
	User,
	Request,
	Header
}


