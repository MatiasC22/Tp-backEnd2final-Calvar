import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";

export const purchaseCartService = async (cartId) => {
    try {
        const cart = await cartModel.findById(cartId).populate("products.id_prod");

        if (!cart) {
            return { status: 404, data: { message: "Carrito no encontrado" } };
        }

        let totalAmount = 0;
        const purchasedProducts = [];
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = item.id_prod;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;
                purchasedProducts.push({
                    id: product._id,
                    title: product.title,
                    quantity: item.quantity,
                    price: product.price,
                });
            } else {
                unavailableProducts.push(product._id);
            }
        }

        if (purchasedProducts.length === 0) {
            return { status: 400, data: { message: "No hay stock suficiente para realizar la compra" } };
        }

        
        const ticket = await ticketModel.create({
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: "usuario@email.com", 
        });

        cart.products = cart.products.filter((item) => unavailableProducts.includes(item.id_prod._id));
        await cart.save();

        return {
            status: 200,
            data: {
                message: "Compra realizada con éxito",
                ticket,
                unavailableProducts,
            },
        };
    } catch (e) {
        return { status: 500, data: { message: "Error al procesar la compra", error: e.message } };
    }
};
