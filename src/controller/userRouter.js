import {Router} from "express";
import bcrypt from "bcrypt";
import {body} from "express-validator";
import jwt from "jsonwebtoken";

import {User} from "../models/index.js";
import {JWT_SECRET} from "../utils/config.js";
import {tokenExtractor, tokenValidator, validateErrors} from "../utils/middleware.js";


const userRouter = Router()

userRouter.get('/',
	tokenExtractor,
	tokenValidator,
	async (request, response, next) => {
		validateErrors(request, response, next)

		if (response.headersSent) {
			return
		}

		return response.json({message: 'valid token'})
	})

userRouter.post('/signup',
	body('username')
		.escape().trim().isLength({min: 3})
		.withMessage('username must be at least 3 characters long'),
	body('password')
		.escape().trim().isLength({min: 3})
		.withMessage('password must be at least 3 characters long'),
	async (request, response, next) => {
		validateErrors(request, response, next)

		if (response.headersSent) {
			return
		}

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
	body('username').escape().isString().trim(),
	body('password').escape().isString().trim(),
	async (request, response, next) => {
		validateErrors(request, response, next)

		if (response.headersSent) {
			return
		}

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
