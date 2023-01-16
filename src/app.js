import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import "express-async-errors";

import {configureDB} from "./utils/config.js";
import {errorHandler, tokenExtractor, tokenValidator, unknownEndpoint, validateToken} from "./utils/middleware.js";
import userRouter from "./routes/userRouter.js";
import requestRouter from "./routes/requestRouter.js";

const app = express()

await configureDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use('/api/auth', userRouter)

app.use('/api/request', requestRouter)

app.use(unknownEndpoint)
app.use(errorHandler)
export default app
