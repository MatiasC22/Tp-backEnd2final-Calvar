export const authorization = (rol) => {
    return async (req, res, next) =>{
        //Consultas si existe una sesion Activa
        console.log("auto", req.user);
        if(!req.user) return res.status(401).send("No Autenticado")
        if(req.user.rol != rol) return res.status(403).send("No autorizado")
        next()
    }
}