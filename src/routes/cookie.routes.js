import { Router } from "express";
import { setCookie , getCookie, deleteCookie,setSignedCookie, getSignedCookie} from "../controllers/cookie.controller.js";

const cookieRouter = Router()

cookieRouter.get('/setCookie',setCookie)
cookieRouter.get('/getCookie',getCookie)
cookieRouter.get('/deleteCookie',deleteCookie)
cookieRouter.get('/setSignedCookie',setSignedCookie)
cookieRouter.get('/getSignedCookie',getSignedCookie)  


export default cookieRouter;