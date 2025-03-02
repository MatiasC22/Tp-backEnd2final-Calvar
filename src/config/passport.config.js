import { githubCliSecret, githubCliId } from '../servidor.js';
import passport from 'passport';
import local, { Strategy } from 'passport-local';
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt';
import {validatePassword, createHash} from '../utils/bcript.js';
import userModel from '../models/user.js';
import { ifError } from 'assert';



const localStrategy = local.Strategy // Defino la estrategia local 
const JWTStrategy = jwt.Strategy;
const ExtractorJWT = jwt.ExtractJwt;

const cookieExtractor= (req) => {
    let token = null
    if(req && req.cookies){
        token = req.cookies['coderCookie']// consulto unicamente por las cookies con este nombre
        console.log(req.cookies);
    }
    return token
}

//Middleware para errores de passport
export const passportCall = (strategy) => {
    return async(req,res,next) => {
        
        passport.authenticate(strategy, function(err,user, info) {
            if(err) return next(err)
            
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            }
            req.user = user
            next()
        } (req,res,next))
    }
}

const initalizatePassport = () => {
    passport.use('register', new localStrategy({passReqToCallback: true, usernameField:'email'}, async(req,username, password, done)=>{
        try {
            const { first_name, last_name, email, password, age } = req.body;

            const findUser = await userModel.findOne({email: email})

            // Si Usuario Existe 
            if (!findUser){
                
                const user = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: createHash(password),
                    age: age
                })
                return done(null, user) // Doy Aviso de que genere un nuevo Usuario
            }else{
                return done(null, false)// No devuelvo error pero no genero error un nuevo Usuario 
            }                
        } catch (e) {
            console.log(e)
            return done(e)
        }
    }))

    passport.use('login', new localStrategy({usernameField:'email'}, async(username, password, done)=>{
        try {
            const user = await userModel.findOne({ email: username })
            if(user && validatePassword(password, user.password)){
                //generateToken(user)
                return done(null, user)
            }else{
                return done(null, false)
            }
        } catch (e) {
            return done(e)
        }
        
    
        
    }))


    passport.use('github', new GitHubStrategy({
        clientID: githubCliId, 
        clientSecret: githubCliSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        try {
                
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                const user = await userModel.create({
                    first_name: profile._json.name,
                    last_name: " ", // Dato no proporcionado por GitHub
                    email: profile._json.email, 
                    password: '1234', // Generar contraseña por defecto
                    age: 18 // Dato no proporcionado por GitHub
                });
                done(null, user);
            } else {
                
                done(null, user);
            }
        } catch (e) {
            console.log(e);
            return done(e);
        }
    }));
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractorJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "codercoder",
    }, async (jwt_playload, done)=> {
        try {
            return done(null, jwt_playload.user)
        } catch (e) {
            return done(err)
        }
    }))

    //Pasos necesarios para trabajar via HTTP
    passport.serializeUser((user,done)=>{
        
            done(null, user._id)
        
        
    })

    passport.deserializeUser(async(id, done)=>{
        const user= await userModel.findById(id)
        done(null, user)

    })
}

export default initalizatePassport;