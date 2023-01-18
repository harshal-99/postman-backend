import {Router} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {User} from "../models/index.js";
import {JWT_SECRET} from "../utils/config.js";
import {tokenExtractor, tokenValidator} from "../utils/middleware.js";


const userRouter = Router()

userRouter.get('/',
	tokenExtractor,
	tokenValidator,
	async (request, response, next) => {
		return response.json({message: 'valid token'})
	})

userRouter.post('/signup',
	async (request, response, next) => {
		const {username, password} = request.body

		const saltRounds = 5
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = await User.create({
			username,
			password: passwordHash
		})

		response.json({username: user.username, id: user.id})
	})

userRouter.post('/login',
	async (request, response, next) => {

		const {username, password} = request.body

		let user = await User.findOne({where: {username: username}})
		if (!user) {
			return response.status(401).json({error: 'invalid username or password'})
		}
		user = user.toJSON()
		const passwordCorrect = await bcrypt.compare(password, user.password)
		if (!passwordCorrect) {
			return response.status(401).json({error: 'invalid username or password'})
		}

		const userForToken = {
			username: user.username,
			id: user.id
		}

		const token = jwt.sign(userForToken, JWT_SECRET, {expiresIn: 60 * 60})

		response
			.status(200)
			.send({token, username: user.username, id: user.id})
	})

export default userRouter;
