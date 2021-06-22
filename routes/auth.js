//Importando express
const express = require('express');
//Importando passport para implementar estrategias de autenticación
const passport = require('passport');
//Importando boom para el manejo de errores
const boom = require('@hapi/boom');
//Importando jwt para crear el jwt firmado
const jwt = require('jsonwebtoken');
//Importando validation
const validationHandler = require('../utils/middleware/validationHandler');

//Importando archivo de configuración para tener acceso al secret
const { config } = require('../config');

//Importando las estructura del schema
const { createUserSchema, createProviderUserSchema } = require('../utils/schemas/users');

//Importando capa de servicios
const ApiKeyService = require('../services/apiKeys');
const UsersService = require('../services/users');

//Usando la estrategi BasicStrategy
require('../utils/auth/strategies/basic');

//Funcion que recibe una aplicación de express y crearemos alli las rutas
function authApi(app) {
    const router = express.Router();
    //Ruta de inicio
    app.use('/api/auth', router);

    //Instanciando capa de servicios
    const apiKeyService = new ApiKeyService();
    const usersService = new UsersService();

    //Metodo post que nos permite logearnos
    router.post('/sign-in', async(req, res, next) => {
        //Verificando que del cuerpo nos venga un apiKeyToken
        const { apiKeyToken } = req.body;

        //Verificar que el token exista
        if (!apiKeyToken) {
            next(boom.unauthorized('apiKeyToken is required'));
        }

        //Este metodo nos devuelve un jwt a partir del archivo de strategias, basic.js
        passport.authenticate('basic', (error, user) => {
            try {
                //Validando que no haya un error y haya un usuario
                if (error || !user) {
                    next(boom.unauthorized())
                }

                //Estableciendo la login session
                req.login(user, { session: false }, async(err) => {
                    //Validando que no hayan errores
                    if (err) {
                        next(err);
                    }

                    //Buscamos la apiKey
                    const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken })

                    //Verificando que exista la apiKey
                    if (!apiKey) {
                        next(boom.unauthorized());
                    }

                    //Si todo esta bien, procedemos a construir y firmar el jwt
                    const { _id: id, name, email } = user;

                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }

                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    });

                    return res.status(200).json({
                        token,
                        user: { id, name, email }
                    })
                })

            } catch (error) {
                next(err)
            }
        })(req, res, next)
    })

    //El middleware lo colocamos entre la ruta y la definicion de la ruta
    //Metodo post para crear usuarios
    router.post('/sign-up', validationHandler(createUserSchema), async(req, res, next) => {
        //Enviamos el cuerpo user a traves del body 
        const { body: user } = req;

        try {
            //Creando e insertando el usuario
            const createdUserId = await usersService.createUser({ user });
            res.status(201).json({
                data: createdUserId,
                message: 'user created'
            })
        } catch (error) {
            next(error)
        }
    })

    //El middleware lo colocamos entre la ruta y la definicion de la ruta
    //Metodo post que nos permite logearnos con google, facebook o algun otro
    router.post('/sign-provider', validationHandler(createProviderUserSchema), async(req, res, next) => {
        //Sacamos el body de la petición
        const { body } = req;

        //Sacamos el apiKeyToken del body
        const { apiKeyToken, ...user } = body;

        //Validando que exista un apiKeyToken
        if (!apiKeyToken) {
            next(boom.unauthorized('apiKeyToken is required'));
        }

        try {
            //Query que almacena la info del usuario creado o encontrado
            const queriedUser = await usersService.getOrCreateUser({ user });
            //Obteniendo el apiKey
            const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

            //Validando que exista el apiKey
            if (!apiKey) {
                next(boom.unauthorized());
            }

            //Si todo esta bien, procedemos a construir y firmar el jwt
            const { _id: id, name, email } = queriedUser;

            //Payload
            const payload = {
                sud: id,
                name,
                email,
                scopes: apiKey.scopes
            }

            const token = jwt.sign(payload, config.authJwtSecret, {
                expiresIn: '15m'
            });

            return res.status(200).json({ token, user: { id, name, email } })

        } catch (error) {
            next(error);
        }
    })
}


//Exportanto función
module.exports = authApi;