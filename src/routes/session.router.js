import { Router } from "express";
import { getSession, getLogoutSession, auth, loguinSession } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.get('/session', getSession)
sessionRouter.get('/logout', getLogoutSession)
sessionRouter.get('/login', loguinSession)
sessionRouter.get('/private', auth, (req,res)=>{
    res.status(200).send("Contenido de f@f.com")
})

export default sessionRouter;