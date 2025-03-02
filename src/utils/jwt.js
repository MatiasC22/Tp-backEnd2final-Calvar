import jwt from 'jsonwebtoken'


let secretKey = "codercoder"

export const generateToken = (user)=>{

    /*
        param1: Objeto a guardar (user en este caso)
        param2 : Clave Privada 
        param3 : Tiempo de Vida del Token
    */


    const token = jwt.sign({user}, secretKey,{expiresIn: '24h'})

    return token

}


