import { Router } from "express";
import { authorization } from "../config/middlewares.js";
import { getCart, createCart, insertProductCart, updateProductCart, updateQuantityProductCart, deleteCart, deleteProductCart, checkout } from "../controllers/cartsController.js";

const cartRouter = Router()

cartRouter.get('/:cid', getCart )
cartRouter.post('/',authorization("Usuario"), createCart )
cartRouter.post('/:cid/products/:pid',authorization("Usuario"), insertProductCart)
cartRouter.post('/:cid/checkout',authorization("Usuario"), checkout)
cartRouter.put('/:cid',authorization("Usuario"), updateProductCart)
cartRouter.put('/:cid/products/:pid',authorization("Usuario"), updateQuantityProductCart )
cartRouter.delete('/:cid', deleteCart )
cartRouter.delete('/:cid/products/:pid',authorization("Usuario"), deleteProductCart )


export default cartRouter