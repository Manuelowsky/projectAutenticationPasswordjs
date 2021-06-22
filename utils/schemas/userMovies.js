/* 
    Este esquema permite que cuando hagamos llamado a los endpoints podamos tener
    el formato correcto de estos endpoints
*/

//Importar joi para definir el esquema
const joi = require('@hapi/joi');

//Importando la estructura del id de la pelicula
const { movieIdSchema } = require('./movies');
//Importando la estructura del id del usuario
const { userIdSchema } = require('./users');

//Estructura que debe tener el id del userMovie (String y Expresion regular)
const userMovieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}/);

//Estructura que debe tener el userMovie al crearlo
const createUserMovieSchema = {
    userId: userIdSchema,
    movieId: movieIdSchema
}

//Exportamos modulos
module.exports = {
    userMovieIdSchema,
    createUserMovieSchema
}