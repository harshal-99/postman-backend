import {Router} from "express";
import {tokenExtractor, tokenValidator, validateErrors, validateToken} from "../utils/middleware.js";
import {body, param, query} from "express-validator";
import User from "../models/user.js";
import Request from "../models/request.js";
import Header from "../models/header.js";

const requestRouter = Router()

requestRouter.get('/',
	tokenExtractor,
	tokenValidator,
	async (request, response, next) => {
		const requests = await Request.find({}).populate('headers')
		response.json(requests)
	}
)

requestRouter.get('/:id',
	param('id').isMongoId(),
	async (request, response, next) => {
		validateErrors(request, response, next)

		if (response.headersSent) {
			return
		}

		const requestId = request.params.id
		const foundRequest = await Request
			.findById(requestId)
			.populate('headers')

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}

		return response.json(foundRequest)
	}
)

requestRouter.post('/:id',
	tokenExtractor,
	tokenValidator,
	param('id').notEmpty(),
	body('url').isString(),
	body('type').isString(),
	body('body').isString(),
	body('headers').isArray(),
	async (request, response, next) => {
		const decodedToken = validateToken(request, response, next)

		if (response.headersSent) {
			return
		}

		const user = User.findById(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id

		if (requestId === '0') {
			const newRequest = new Request({
				url: '',
				type: '',
				body: '',
				headers: [],
			})
			const savedRequest = await newRequest.save()
			return response.status(201).json(savedRequest)
		}

		let foundRequest = await Request.findById(requestId)

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}

		const {url, type, body} = request.body

		foundRequest.url = url
		foundRequest.type = type
		foundRequest.body = body

		const savedRequest = await foundRequest.save()

		return response.json(savedRequest)
	}
)

requestRouter.delete('/:id',
	tokenExtractor,
	tokenValidator,
	param('id').isMongoId(),
	async (request, response, next) => {
		const decodedToken = validateToken(request, response, next)

		if (response.headersSent) {
			return
		}

		const user = User.findById(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id

		await Request.findByIdAndDelete(requestId)
		return response.status(204).end()
	}
)


requestRouter.post('/:id/header/:headerId',
	tokenExtractor,
	tokenValidator,
	param('id').isMongoId(),
	param('headerId').notEmpty(),
	body('key').notEmpty().isString(),
	body('value').notEmpty().isString(),
	body('checked').notEmpty().isBoolean(),
	async (request, response, next) => {
		const decodedToken = validateToken(request, response, next)

		if (response.headersSent) {
			return
		}

		const user = User.findById(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id
		const headerId = request.params.headerId
		const foundRequest = await Request.findById(requestId)

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}

		if (headerId === '0') {
			const newHeader = new Header({
				key: '',
				value: '',
				checked: false,
			})
			const savedHeader = await newHeader.save()
			foundRequest.headers.push(savedHeader)
			const savedRequest = await foundRequest.save()
			return response.status(201).json(savedRequest)
		} else {
			const foundHeader = await Header.findById(headerId)

			if (!foundHeader) {
				return response.status(404).json({error: 'header not found'})
			}

			const {key, value, checked} = request.body
			foundHeader.key = key
			foundHeader.value = value
			foundHeader.checked = checked
			await foundHeader.save()
			const savedRequest = await foundRequest.save()
			return response.json(savedRequest)
		}
	}
)

requestRouter.delete('/:id/header/:headerId',
	tokenExtractor,
	tokenValidator,
	param('id').isMongoId(),
	param('headerId').isMongoId(),
	async (request, response, next) => {
		const decodedToken = validateToken(request, response, next)

		if (response.headersSent) {
			return
		}

		const user = User.findById(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id
		const headerId = request.params.headerId
		const foundRequest = await Request.findById(requestId)
		foundRequest.headers = foundRequest.headers.filter(header => header.id !== headerId)
		const savedRequest = await foundRequest.save()
		await Header.findByIdAndDelete(headerId)
		return response.status(204).send(savedRequest)
	})

export default requestRouter
