import { Router } from "express";
import { getProduct, getProducts, deleteProduct, updateProducts,createProduct } from "../controllers/productsController.js";
import { authorization } from "../config/middlewares.js";


const productRouter = Router()

productRouter.get('/',getProducts)
productRouter.get('/:pid',getProduct)
productRouter.post('/',authorization("Admin"), createProduct)
productRouter.put('/:pid',authorization("Admin"),updateProducts)
productRouter.delete('/:pid',authorization("Admin"),deleteProduct)

export default productRouter