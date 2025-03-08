import 'dotenv/config';
import jwt from 'jsonwebtoken'



export const generateToken = (user)=>{

    /*
        param1: Objeto a guardar (user en este caso)
        param2 : Clave Privada 
        param3 : Tiempo de Vida del Token
    */


    const token = jwt.sign({user}, process.env.SECRET_JWT,{expiresIn: '24h'})

    return token

}


