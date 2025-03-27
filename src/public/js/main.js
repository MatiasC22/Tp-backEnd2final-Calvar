async function addToCart(productId) {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
        alert("Error: No se encontró el carrito del usuario.");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });

        if (response.ok) {
            console.log("Producto agregado al carrito");
            socket.emit("updateCart"); // Notificar actualización en tiempo real
        } else {
            console.error("Error al agregar el producto");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}


async function getCartId() {
    try {
        const response = await fetch("/api/sessions/current", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Si usas JWT en localStorage
            }
        });
        const data = await response.json();
        if (data.cartId) {
            localStorage.setItem("cartId", data.cartId);
        }
    } catch (error) {
        console.error("Error obteniendo el cartId:", error);
    }
}

// Llamar a la función al cargar la página
getCartId();