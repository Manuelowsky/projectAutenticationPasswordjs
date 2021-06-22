/*
    Para crear la Ruta del Api de getUserMovies, consumimos el servicio userMoviesService.getUserMovies 
    con el userId.
*/

//Importando express
const express = require('express');

//Importando capa de servicios
const UserMoviesService = require('../services/userMovies');

//Importando validation
const validationHandler = require('../utils/middleware/validationHandler');
//Importando validation de los scopes
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

//Importando las estructuras de los schemas
const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');
const passport = require('passport');

//Importando estrategia jwt
require('../utils/auth/strategies/jwt');

//Funcion que recibe una aplicación de express y crearemos alli las rutas
function userMoviesApi(app) {
    const router = express.Router();
    //Ruta de inicio
    app.use('/api/user-movies', router);

    //Instanciando capa de servicios
    const userMoviesService = new UserMoviesService();

    //El middleware lo colocamos entre la ruta y la definicion de la ruta
    //passport.authenticate para proteger ruta
    //Ruta para obtener por metodo get el listado de las peliculas del usuario
    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        //Enviamos el permiso que tiene esta ruta get
        scopesValidationHandler(['read:user-movies']),
        validationHandler({ userId: userIdSchema }, 'query'), async(req, res, next) => {
            const { userId } = req.query;
            try {
                const userMovies = await userMoviesService.getUserMovies({ userId });
                res.status(200).json({
                    data: userMovies,
                    message: 'user movies listed'
                })
            } catch (error) {
                next(error);
            }
        }
    )

    //El middleware lo colocamos entre la ruta y la definicion de la ruta
    //passport.authenticate para proteger ruta
    //Ruta para agregar por metodo post una nueva pelicula a la lista de favoritos
    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        //Enviamos el permiso que tiene esta ruta post
        scopesValidationHandler(['create:user-movies']),
        validationHandler(createUserMovieSchema),
        async(req, res, next) => {
            //Enviamos la informacion de la pelicula del usuario a traves del body 
            const { body: userMovie } = req;
            try {
                //Creando la pelicula del usuario y devolviendo el id 
                const createUserMovieId = await userMoviesService.createUserMovie({ userMovie });
                res.status(201).json({
                    data: createUserMovieId,
                    message: 'user movie created'
                })
            } catch (error) {
                //Manejo de error con express
                next(error)
            }
        }
    )

    //El middleware lo colocamos entre la ruta y la definicion de la ruta
    //passport.authenticate para proteger ruta
    //Metodo delete que nos permite eliminar una pelicula de la lista de favoritas, de acuerdo al id que enviemos
    router.delete(
        "/:userMovieId",
        passport.authenticate('jwt', { session: false }),
        //Enviamos el permiso que tiene esta ruta delete
        scopesValidationHandler(['delete:user-movies']),
        validationHandler({ userMovieId: movieIdSchema }, 'params'),
        async(req, res, next) => {
            //Datos que ingresamos desde la url (Igual nombre que en la url)
            const { userMovieId } = req.params;
            try {
                //Eliminando y devolviendo el id de la pelicula que se elimino
                const deletedUserMovieId = await userMoviesService.deleteUserMovie({ userMovieId });
                //console.log(userMovieId);
                res.status(200).json({
                    data: userMovieId,
                    message: 'movie user deleted'
                })
            } catch (err) {
                //Manejo de error con express
                next(err);
            }
        }
    )
}

//Exportanto función
module.exports = userMoviesApi;