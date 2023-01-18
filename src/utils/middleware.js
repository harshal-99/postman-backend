import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config.js";

export const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}
	next()
}

export const errorHandler = (error, request, response, next) => {
	console.log(error.name)
	console.log(error.message)
	switch (error.name) {
		case 'ValidationError':
			return response.status(400).json({error: error.message})
		case 'JsonWebTokenError':
			return response.status(401).json({error: 'invalid token'})
		case 'TokenExpiredError':
			return response.status(401).json({error: 'token expired'})
		case 'SequelizeUniqueConstraintError':
			return response.status(400).json({error: 'username must be unique'})
	}
	next(error)
}
export const tokenValidator = (request, response, next) => {
	const token = request.token
	if (!token) {
		return response.status(401).json({error: "token missing"})
	}

	const decodedToken = jwt.verify(token, JWT_SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({error: "invalid token Login again"})
	}
	next()
}

export const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "unknown endpoint"})
}

export const validateToken = (request, response, next) => {
	const decodedToken = jwt.verify(request.token, JWT_SECRET)
	if (!request.token || !decodedToken?.id) {
		return response.status(401).json({error: 'token missing or invalid'})
	}
	return decodedToken
}

