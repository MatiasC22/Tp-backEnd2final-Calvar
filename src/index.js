import {MGDB} from './servidor.js';
import express from 'express';
import path from 'path';
import { __dirname } from './path.js';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { create } from 'express-handlebars';
import passport from 'passport';
import initalizatePassport from './config/passport.config.js';
import MongoStore from 'connect-mongo';
import indexRouter from './routes/index.routes.js';
import mongoose from 'mongoose';
import cors from 'cors'




const app = express();
const PORT = 8080;
const hbs = create();
app.use(cors())
//const fileStore = FileStore(session);

app.use(express.json())





app.use(cookieParser("CoderSecret")) // Si Agrego contraseña "Firmo" las Cookies
app.use(session({
    // ttl:   Tiempo de vida de la sesion en segundos
    // retries:  Cantidad de veces que el servidor va a intentar leer el Archivo
    //store: new fileStore({path: './src/sessions', ttl: 60, retries: 1}),
    store: MongoStore.create({
        mongoUrl: MGDB,
        mongoOptions: {},
        ttl: 15,
    }),
    secret: 'SessionSecret',
    resave: true,//Perminete manterner la sesion activa en caso de que 
    //la sesion se mantenga inactiva. Si se deja en false, la sesion 
    // Morira en caso de que exista cierto tienpo de inactividad 
    saveUninitialized: true // Permite guardar Cualquier sesion aun cuando el 
    // objeto de sesion no tenga nada por contener. Si se feja en false, la 
    // sesion no se guardara si el objeto de sesion esta bacio al final de la 
    //consulta.
}))

mongoose.connect(MGDB)
    .then(()=>{console.log("DB is connected")})
    .catch((e)=>{console.log("Error al Conectar DB: ", e)})

initalizatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')) //Concateno evitando erroes de / o \
app.use(express.static(path.join(__dirname, "public"))); // Concateno rutaswww
app.use('/', indexRouter)

app.get('/',(req,res)=>{
    res.status(200).send("Hola desde Inicio")})

app.listen(PORT, ()=>{
    console.log("Server on port: ", PORT)
})