import {Router} from "express";
import bcrypt from "bcrypt";
import {body} from "express-validator";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import {JWT_SECRET} from "../utils/config.js";
import {validateErrors} from "../utils/middleware.js";


const userRouter = Router()

userRouter.post('/signup',
	body('username')
		.escape().trim().isLength({min: 3})
		.withMessage('username must be at least 3 characters long'),
	body('password')
		.escape().trim().isLength({min: 3})
		.withMessage('password must be at least 3 characters long'),
	async (request, response, next) => {
		validateErrors(request, response, next)

		if(response.headersSent) {
			return
		}

		const {username, password} = request.body

		const saltRounds = 5
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = new User({
			username,
			passwordHash
		})

		const savedUser = await user.save()
		response.json({username: savedUser.username, id: savedUser.id})
	})

userRouter.post('/login',
	body('username').escape().isString().trim(),
	body('password').escape().isString().trim(),
	async (request, response, next) => {
		validateErrors(request, response, next)

		if(response.headersSent) {
			return
		}

		const {username, password} = request.body

		const user = await User.findOne({username})
		if (!user) {
			return response.status(401).json({error: 'invalid username or password'})
		}

		const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
		if (!passwordCorrect) {
			return response.status(401).json({error: 'invalid username or password'})
		}

		const userForToken = {
			username: user.username,
			id: user._id
		}

		const token = jwt.sign(userForToken, JWT_SECRET, {expiresIn: 60 * 60})

		response
			.status(200)
			.send({token, username: user.username, id: user.id})
	})

export default userRouter;
