document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('registerForm')
   

    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault()
       

        const formData = new FormData(e.target)
        const userData = Object.fromEntries(formData)

        try {
            const response = await fetch('/api/sessions/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include"
            })

            const data = await response.json()

            if (data?.message == "Usuario creado correctamente") {
                
                e.target.reset()
                window.location.href = "http://localhost:8080/api/sessions/viewlogin"
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