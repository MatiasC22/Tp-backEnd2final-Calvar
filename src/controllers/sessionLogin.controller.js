// import {generateToken} from "../utils/jwt.js"


// export const login = async (req, res) => {
//     try {
//         if(!req.user){
//             return res.status(401).send("Usuario o Contraseña no Validos")
//         }

//         const token = generateToken(req.user)

//         req.session.user= {
//             email:  req.user.email,
//             first_name: req.user.first_name
//         }
        
//         //Previo a redireccionar, envio la cookie
//         res.status(200).cookie('coderCookie', token, {
//             httpOnly: true,
//             secure: false, //Evitar errores por https
//             maxAge: 3600000 //Una hora
//         }).send({message: "Usuario logueado"})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al loguear Usuario")
//     }
   
// }


// export const register = async (req, res) => {
//     try {
//         console.log(req.user);
//         if(!req.user){// Consulto si en la session se encuentra mi usuario
//             return res.status(400).send("El Mail ya se encuentra registrado")
//         }            
//          res.status(201).send('Usuario Registrado Correctamente'); 
//     } catch (e) {
//         console.log(e);
//         res.status(500).send( "Error al registrar usuario");
//     }
// };

// export const viewRegister = ( req,res)=>{
//     res.status(200).render('templates/register',{})
// }

// export const viewLogin = ( req,res)=>{
//     res.status(200).render('templates/Login',{
//         url_js: "/js/login.js",
//         url_css: "/css/login.css"
//     })
// }

// export const githubLogin = (req,res)=> {
    
//     try {
//         if(!req.user){
//             return res.status(401).send("Usuario o Contraseña no Validos")
//         }
//         req.session.user= {
//             email:  req.user.email,
//             first_name: req.user.first_name
//         }
//         res.status(200).cookie('coderCookie', token, {
//             httpOnly: true,
//             secure: false, //Evitar errores por https
//             maxAge: 3600000 //Una hora
//         }).send({message: "Usuario logueado"})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al loguear Usuario")
//     }
// }

import { generateToken } from "../utils/jwt.js"

export const login = async (req,res) => {
    try {
        if(!req.user) {
            return res.status(401).send("Usuario o contraseña no validos")
        }

        const token = generateToken(req.user)

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        } 
        

        res.status(200).cookie('coderCookie', token, {
            httpOnly: true,
            secure: false, //Evitar errores por https
            maxAge: 3600000 //Una hora
        }).send({message: "Usuario logueado correctamente"})
    }catch(e) {
        console.log(e); 
        res.status(500).send({message: "Error al loguear usuario"})
    }     
}

export const register = async (req,res) => {
    try {
        if(!req.user) { //Consulto si en la sesion se encuentra mi usuario
            return res.status(400).send("El mail ya se encuentra registrado")
        } 
        return res.status(201).send({message: "Usuario creado correctamente"})
    }catch(e) {
        console.log(e);
        res.status(500).send({message: "Error al registrar usuario"})
    }
    
}

export const viewRegister = (req,res) => {
    res.status(200).render('templates/register', {
        title: "Registro de Usuario",
        url_js: "/js/register.js",
        url_css: "/css/register.css"
    })
}

export const viewLogin = (req,res) => {
    res.status(200).render('templates/login', {
        title: "Inicio de Sesion de Usuario",
        url_js: "/js/login.js",
        url_css: "/css/login.css"
    })
}

export const githubLogin = (req,res) => {
    try {
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        } 
        const token = generateToken(req.user)
        res.status(200).cookie('coderCookie', token, {
            httpOnly: true,
            secure: false, //Evitar errores por https
            maxAge: 3600000 //Una hora
        }).redirect("/api/products")
    }catch(e) {
        console.log(e); 
        res.status(500).send("Error al loguear usuario")
    }  
}