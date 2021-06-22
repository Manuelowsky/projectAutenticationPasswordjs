/*
    Teniendo en cuenta una relación de muchos a muchos, en la que un usuario podrá tener muchas 
    películas favoritas, y una película podrá ser favorita de muchos usuarios.

    Definimos los servicios, así como los schemas de Ver, Crear y eliminar la relación de usuarios 
    y películas (userMovies), muy similar a lo que hicimos en la colección de usuarios.
*/

//Importando el archivo de lib mongo, que contiene los metodos de mongo.
const MongoLib = require('../lib/mongo');


//Servicio que tiene lógica de negocio
class UserMoviesService {
    constructor() {
        //Nombre de nuestra coleccion
        this.collection = 'user-movies';
        this.mongoDB = new MongoLib();
    }

    //Función para obtener las peliculas del usuario
    async getUserMovies({ userId }) {
        const query = userId ? { userId } : userId;
        //Devuelve las peliculas del usuario
        const userMovies = await this.mongoDB.getAll(this.collection, query);
        return userMovies || [];
    }

    //Función para crear una pelicula al usuario (Agregar pelicula a lista de favoritos)
    async createUserMovie({ userMovie }) {
        //Devuelve el id de la pelicula del usuario recien creada
        const createdUserMovieId = await this.mongoDB.create(this.collection, userMovie);
        return createdUserMovieId;
    }

    //Función para eliminar una pelicula de la lista de favoritos
    async deleteUserMovie({ userMovieId }) {
        //Devuelve el id de la pelicula del usuario eliminada
        const deletedUserMovieId = await this.mongoDB.delete(
            this.collection,
            userMovieId
        );
        return deletedUserMovieId;
    }
}

//Exportando servicio
module.exports = UserMoviesService;