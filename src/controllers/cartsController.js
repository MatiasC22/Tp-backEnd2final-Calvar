import cartModel from "../models/cart.js";
import { purchaseCartService } from "../controllers/ticketController.js";
import ticketModel from "../models/ticket.js";
import productModel from "../models/product.js";

export const getCart = async (req,res) => {
    try {
        const cartId = req.params.cartId
        const cart = await cartModel.findOne({_id: cartId})
        if(cart)
            res.status(200).send(cart)
        else
            res.status(404).send("Carrito no existe")
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const response = await purchaseCartService(cartId);
        res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).render("templates/error", { e });
    }
};

export const createCart = async (req,res) => {
    try {
        const rta = await cartModel.create({products: []})
        res.status(201).send(rta)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const insertProductCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)

            if(indice != -1 ) {
                cart.products[indice].quantity = quantity
            } else {
                cart.products.push({id_prod: productId, quantity: quantity})
            }

            const rta = await cartModel.findByIdAndUpdate(cartId, cart)
            return res.status(200).send(rta)
        }else {
            res.status(404).send("Carrito no existe")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}
export const updateProductCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const {newProduct} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        cart.products = newProduct
        cart.save()
        res.status(200).send(cart)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const updateQuantityProductCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)

            if(indice != -1 ) {
                cart.products[indice].quantity = quantity
                cart.save()
                res.status(200).send(cart)
            } else {
                res.status(404).send("Producto no encontrado")
            }
        }else {
            res.status(404).send("Carrito no existe")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const deleteProductCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)

            if(indice != -1 ) {
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            } else {
               res.status(404).send("Producto no existe")
            }

        }else {
            res.status(404).send("Carrito no existe")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const deleteCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart ){
            cart.products = []
            cart.save()
            res.status(200).send(cart)
        } else {
            res.status(404).send("Carrito no existe")
        }
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const checkout = async(req,res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)

        if(cart){
            //Ver si Todos los productos tienen stock suficiente
            cart.products.forEach(async()=>{
                let producto = await productModel.findById(prod.id_prod)
                if(producto.stock - prod.quantity < 0){                
                    prodStockNull.push(producto.id)
                }                
            })

            if(prodStockNull.length === 0){ //Solamentefinalizo compra si No ahi productos sin stock
                const aux = [...cart.products]

                let totalAmount

                cart.products.forEach((prod)=>{
                    const prod = productModel.findById(prod.id_prod)
                    let stock = prod.stock
                    prod.stock =  stock -prod.quantity
                    await prod.save()
                    
                })
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: 3,
                    products: cart.products
                })
                await cartModel.findByIdAndUpdate(cartId, {products: []})
                res.status(200).send(newTicket)

                }else{
                    //Saco del carrito todos los productos sin Stock
                    prodStockNull.forEach((prodId)=>{
                        let indice = cart.products.findIndex(prod => prod.id == prodId)
                        cart.products.splice(indice,1)
                        //cart.products = cart.products.filter(prod => prod.id_prod !== prodId)
                    })
                    await cartModel.findByIdAndUpdate(cartId,{
                        products: cart.products
                    })
                    res.status(400).send(prodStockNull)
                }
        }else{
            res.status(404).send({message: "Carrito no existe"})
        }
    } catch (e) {
        res.status.send({message: e})
    }
}