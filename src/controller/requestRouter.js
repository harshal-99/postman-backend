import {Router} from "express";
import {tokenExtractor, tokenValidator, validateToken} from "../utils/middleware.js";
import {body, param} from "express-validator";
import User from "../models/user.js";
import Request from "../models/request.js";
import Header from "../models/header.js";

const requestRouter = Router()

requestRouter.get('/',
	tokenExtractor,
	tokenValidator,
	async (request, response, next) => {

		const decodedToken = validateToken(request, response, next)
		if (response.headersSent) {
			return
		}

		const requests = await Request.find({userId: decodedToken.id}).populate('headers')
		response.json(requests)
	}
)

requestRouter.get('/:id',
	async (request, response, next) => {

		const requestId = request.params.id
		let foundRequest = await Request.findByPk(requestId)

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}
		const savedHeaders = await Header.findAll({where: {RequestId: requestId}})
		foundRequest = foundRequest.toJSON()
		foundRequest.headers = savedHeaders
		return response.json(foundRequest)
	}
)

requestRouter.post('/:id',
	tokenExtractor,
	tokenValidator,
	async (request, response, next) => {
		const decodedToken = validateToken(request, response, next)

		if (response.headersSent) {
			return
		}

		const user = User.findByPk(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id

		if (requestId === '0') {
			const newRequest = await Request.create({
				url: '',
				type: '',
				body: '',
				UserId: decodedToken.id
			})
			const savedRequest = await newRequest.save()
			return response.status(201).json(savedRequest)
		}

		let foundRequest = await Request.findByPk(requestId)

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}

		let {url, type, body, headers} = request.body

		foundRequest.url = url || ''
		foundRequest.type = type || ''
		foundRequest.body = body || ''

		let savedRequest = await foundRequest.save()
		headers ||= []
		for (const header of headers) {
			await Header.update({key: header.key || '', value: header.value || '', checked: header.checked}, {
				where: {
					id: header.id
				}
			})
		}
		savedRequest = savedRequest.toJSON()
		let savedHeaders = await Header.findAll({
			where: {
				RequestId: savedRequest.id
			}
		})
		savedRequest.headers = savedHeaders
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

		const user = User.findByPk(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id

		const savedRequest = await Request.findByPk(requestId)

		const savedHeaders = await Header.find({RequestId: savedRequest.id})
		for (const header of savedHeaders) {
			await header.destroy()
		}
		await savedRequest.destroy()
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

		const user = User.findByPk(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const requestId = request.params.id
		const headerId = request.params.headerId
		const foundRequest = await Request.findByPk(requestId)

		if (!foundRequest) {
			return response.status(404).json({error: 'request not found'})
		}

		if (headerId === '0') {
			const newHeader = await Header.create({
				key: '',
				value: '',
				checked: false,
				RequestId: requestId,
			})

			return response.status(201).json(newHeader)
		}
		return response.end()
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

		const user = User.findByPk(decodedToken.id)

		if (!user) {
			return response.status(401).json({error: 'invalid user'})
		}

		const headerId = request.params.headerId
		const savedHeader = await Header.findByPk(headerId)
		await savedHeader.destroy()
		return response.status(204).end()
	})

export default requestRouter
