import { Router } from "express";
import { githubLogin, login, register, viewLogin, viewRegister } from "../controllers/sessionLogin.controller.js";
import passport from "passport";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../config/middlewares.js";
const sessionLogin = Router()

sessionLogin.get('/viewlogin', viewLogin)
sessionLogin.get('/viewregister', viewRegister)
sessionLogin.post('/login',passport.authenticate('login'), login)
sessionLogin.post('/register',passport.authenticate('register'),register)
sessionLogin.get('/github',passport.authenticate('github',{scope:['user:email']}),  async (req,res)=>{})
sessionLogin.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), githubLogin)
//sessionLogin.get('/current', passport.authenticate('jwt'),authorization("Usuarios"), async (req,res) => res.send(req.user))
sessionLogin.get('/current', passport.authenticate('jwt'), authorization("Usuarios"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
    }

    res.json({ cartId: req.user.cartId });
});

export default sessionLogin;
