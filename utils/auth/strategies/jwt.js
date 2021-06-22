/*
    Implementando la estrategia de JWT, en donde recibiremos en Json web Token y a partir de Token decodificado 
    buscaremos y autenticaremos el usuario.

    Esta implementa la estrategia de JWT que sirve para comprobar cuando se quiere acceder a los demás servicio 
    de la API.
*/

//Importando passport para implementar estrategias de autenticación
const passport = require('passport');
//Importando BasicStrategy
const { Strategy, ExtractJwt } = require('passport-jwt');
//Importando boom para el manejo de errores
const boom = require('@hapi/boom');

//Importando la logica de negocio de los usuarios
const UsersService = require('../../../services/users');

//Importando archivo de configuración para tener acceso al secret
const { config } = require('../../../config');

//Definiendo nueva estrategia
passport.use(
    new Strategy({
        //Secret del config
        secretOrKey: config.authJwtSecret,
        //Authorization Bearer => Solicita un token (JWT)
        //Sacamos el jwt del header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async(tokenPayload, cb) => {
        const userService = new UsersService();

        try {
            const user = await userService.getUser({ email: tokenPayload.email });

            //Verificando que encuentre el usuario
            if (!user) {
                return cb(boom.unauthorized(), false)
            }

            //Eliminando el password del objeto user
            delete user.password;

            //Devolvemos el usuario en adición con los scopes del token Scopes: Los permisos con los que contará el usuario
            cb(null, {...user, scopes: tokenPayload.scopes })
        } catch (error) {
            return cb(err)
        }
    })
)