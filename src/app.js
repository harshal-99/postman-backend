import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import "express-async-errors";

import {errorHandler, unknownEndpoint} from "./utils/middleware.js";
import userRouter from "./controller/userRouter.js";
import requestRouter from "./controller/requestRouter.js";
import {connectToDatabase} from "./utils/db.js";

const app = express()

await connectToDatabase()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use('/api/auth', userRouter)

app.use('/api/request', requestRouter)

app.use(unknownEndpoint)
app.use(errorHandler)
export default app
