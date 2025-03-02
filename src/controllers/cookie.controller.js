

// Creando una Cookie


export  const setCookie = async (req,res)=>{
   // Devuelvo como resultado una cookie
   res.status(200)
    .cookie('coderCookie', 'Este es mi Primera Cookie', {maxAge: 10000})
    .send('Cookie Creada')
}

// Consultar una Cookie 
export  const getCookie = async (req,res)=>{
    // Obtenemos las Cookie Presentes en el Navegador
    res.status(200).send(req.cookies)
}

// Eliminar una Cookie
export  const deleteCookie = async (req,res)=>{
    
    res.status(200).clearCookie('coderCookie').send('Cookie Eliminada')
}


//Crear una cookie Firmada
export  const setSignedCookie = async (req,res)=>{
    res.status(200)
     .cookie('SignedCookie', 'Este es una cookie Firmada', {maxAge: 10000, signed: true})
     .send('Cookie Firmada Creada')
}

// Consultar una Cookie Solo si esta Firmada
export  const getSignedCookie = async (req,res)=>{
    // Obtenemos las Cookie Presentes en el Navegador si estan Firmadas 
    res.status(200).send(req.signedCookies)
}