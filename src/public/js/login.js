document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('loginForm')
   

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault()

        console.log(e.target)

        const formData = new FormData(e.target)
        const userData = Object.fromEntries(formData)

        try {
            const response = await fetch('/api/sessions/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include"
            })

            const data = await response.json()

            if (data?.message == "Usuario logueado correctamente") {
                
                e.target.reset()
                window.location.href = "http://localhost:8080/api/products"
            } else {
                // const errorTxt = await response.json()
                // console.log(errorTxt);
                console.log(data);
            }

        } catch (e) {
            console.log(e);

        }
    })
})

