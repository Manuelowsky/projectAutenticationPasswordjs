/*
    Estrategia de autenticación con Passport.js

    La estrategia básica es para la autenticación del usuario por medio del formulario de 
    login.
*/

//Importando passport para implementar estrategias de autenticación
const passport = require('passport');
//Importando BasicStrategy
const { BasicStrategy } = require('passport-http');
//Importando boom para el manejo de errores
const boom = require('@hapi/boom');
//Importando bcrypt para verificar si el password que ingresa el usuario es igual al de la BD
const bcrypt = require('bcrypt');

//Importando la logica de negocio de los usuarios
const UsersService = require('../../../services/users');

//Definiendo nueva estrategia
passport.use(
    //Authorization Basic => Solicita un usuario y password
    new BasicStrategy(async(email, password, cb) => {
        const userServices = new UsersService();

        try {
            const user = await userServices.getUser({ email });

            //Verificando si el usuario existe o no
            if (!user) {
                return cb(boom.unauthorized(), false);
            }

            //Verificando si el password es similar
            if (!(await bcrypt.compare(password, user.password))) {
                return cb(boom.unauthorized(), false);
            }

            //Eliminando el password del objeto user
            delete user.password;

            return cb(null, user);
        } catch (error) {
            return cb(error);
        }
    })
)