import cartModel from "../models/cart.js";
import ticketModel from "../models/ticket.js";
import productModel from "../models/product.js";
import crypto from "crypto";

export const getCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart)
            res.status(200).send(cart)
        else
            res.status(404).send("Carrito no existe")
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}



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

// export const checkout = async(req,res) => {
//     try {
//         const cartId = req.params.cid
//         const cart = await cartModel.findById(cartId)
//         const prodStockNull= []

//         if(cart){
//             //Ver si Todos los productos tienen stock suficiente
//             for (const prod of cart.products) {
//                 let producto = await productModel.findById(prod.id_prod)
//                 if(producto.stock - prod.quantity < 0){                
//                     prodStockNull.push(producto.id)
//                 }
//             }            

//             if(prodStockNull.length === 0){ //Solamentefinalizo compra si No ahi productos sin stock
                

//                 //Descuento el stock de cada uno de los productos y calculo el total de compra
//                 let totalAmount = 0 ;

//                 for (const prod of cart.products) {
//                     const producto = await productModel.findById(prod.id_prod);
//                     if(producto){
//                       producto.stock -= prod.quantity;                    
//                     totalAmount +=  producto.price * prod.quantity;
//                     await producto.save();  
//                     }
                    
//                 }
                
                
//                 const newTicket = await ticketModel.create({
//                     code: crypto.randomUUID(),
//                     purchaser: req.user.email,
//                     amount: totalAmount,
//                     products: cart.products
//                 })

//                 await cartModel.findByIdAndUpdate(cartId, {products: []})
//                 res.status(200).send(newTicket)

//                 }else{
//                     //Saco del carrito todos los productos sin Stock
//                     prodStockNull.forEach((prodId)=>{
//                         let indice = cart.products.findIndex(prod => prod.id == prodId)
//                         cart.products.splice(indice,1)
//                         //cart.products = cart.products.filter(prod => prod.id_prod !== prodId)
//                     })
//                     await cartModel.findByIdAndUpdate(cartId,{
//                         products: cart.products
//                     })
//                     res.status(400).send(prodStockNull)
//                 }
//         }else{
//             res.status(404).send({message: "Carrito no existe"})
//         }
//     } catch (e) {
//         res.status(500).render('templates/error', { message: "Ocurrió un problema en el proceso de compra." });
//     }
// }

export const checkout = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate("products.id_prod");

        if (!cart) {
            return res.status(404).json({ message: "Carrito no existe" });
        }

        let prodStockNull = [];
        let totalAmount = 0;

        // Verificar stock y calcular total
        for (const prod of cart.products) {
            const producto = prod.id_prod;
            if (!producto) continue;

            if (producto.stock < prod.quantity) {
                prodStockNull.push(producto._id.toString());
            } else {
                totalAmount += producto.price * prod.quantity;
            }
        }

        if (prodStockNull.length === 0) {
            // Descontar stock
            for (const prod of cart.products) {
                const producto = prod.id_prod;
                producto.stock -= prod.quantity;
                await producto.save();
            }

            // Crear el ticket de compra
            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: totalAmount,
                products: cart.products,
                purchase_datetime: new Date()
            });

            // Vaciar el carrito después de la compra
            await cartModel.findByIdAndUpdate(cartId, { products: [] });

            return res.status(200).json(newTicket);
        } else {
            // Filtrar productos sin stock del carrito
            cart.products = cart.products.filter(prod => !prodStockNull.includes(prod.id_prod._id.toString()));
            await cart.save();

            return res.status(400).json({ message: "Algunos productos no tienen stock", prodStockNull });
        }
    } catch (e) {
        console.error("Error en checkout:", e);
        return res.status(500).json({ message: "Ocurrió un problema en el proceso de compra." });
    }
};