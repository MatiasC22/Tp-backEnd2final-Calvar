import express from "express";
import productRouter from './products.routes.js';
import cartRouter from './carts.routes.js'
import sessionRouter from './carts.routes.js'
import sessionLogin from './sessionLogin.routes.js'
import cookieRouter from './cookie.routes.js'
import { __dirname } from "../path.js";

const indexRouter = express.Router()

indexRouter.use('/public',express.static(__dirname + '/public'))
indexRouter.use('/', cookieRouter)
indexRouter.use('/', sessionRouter)
indexRouter.use('/api/sessions', sessionLogin)
indexRouter.use('/api/products',productRouter)
indexRouter.use('/api/carts',cartRouter)

export default indexRouter;