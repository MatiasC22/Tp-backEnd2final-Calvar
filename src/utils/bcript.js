import 'dotenv/config';
import {hashSync, compareSync,genSaltSync  } from 'bcrypt';

// Encriptar  Contraseña
export const createHash = (password) => hashSync(password, genSaltSync(parseInt(process.env.SALT))) //el numero hace referencia a que tan grande es el nuvel de encriptado 

//Validar mi contraseña con la Ingresada por el Usuario
export const validatePassword = (passIngresada, passBDD) => compareSync(passIngresada, passBDD)

