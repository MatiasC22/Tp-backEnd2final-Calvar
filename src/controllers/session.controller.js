// Controlador de sessiones 

export const  getSession = (req,res)=>{
    //Si al conectarse la Session ya existe aumentar el contador 
    if(req.session.counter){
        console.log(req.session)
        req.session.counter++;
        console.log(req.session)
        return res.status(200).send(`Se ha visitado el sitio ${req.session.counter} veces`)
        
    }else{
        //Si no ahi aun una sesion para el usuario, entonces inicializar  en 1
        req.session.counter = 1;
       return res.status(200).send('Bienvenido!!!')
    }
}


export const  getLogoutSession = (req,res)=>{
    req.session.destroy( err =>{
        if(!err){
            res.status(200).send('Logout ok!')
        }else{
            res.status(500).send({status: 'Logout ERROR', body: err})
        }
    })
}

export const  loguinSession = (req,res)=>{

    const {email, password} = req.body

     
    if(email == "f@f.com" && password == "1234" || email == "pepe@pepe.com" && password == "1234"){
        req.session.email = email
        req.session.admin = true
        res.status(200).send(`Usuario ${email} Logueado`)
    }else{
        
        res.status(400).send('Usuario o Contraseña No Validos!!!')
    }
}


export const  auth = (req,res,next)=>{
        
    if(req.session.email == "f@f.com"){
        return next() //continuo con la ejecucion NOrmal
    }else{
        
        return res.status(401).send('Error de Autorizacion') //401 error de Autenticacion 
    }
}