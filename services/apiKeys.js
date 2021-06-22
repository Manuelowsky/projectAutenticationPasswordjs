/*
    Este servicio permite, que a partir de un apiToken podamos obtener los scopes(Permisos)
*/

//Importando el archivo mongo.js
const MongoLib = require('../lib/mongo');

//Servicio que tiene toda la lógica de negocio
class ApiKeysService {
    constructor() {
        //Nombre de nuestra coleccion
        this.collection = 'api-keys';
        this.mongoDB = new MongoLib();
    }

    //Metodo para obtener un apikey de la bd
    async getApiKey({ token }) {
        const [apiKey] = await this.mongoDB.getAll(this.collection, { token });
        return apiKey;
    }
}

module.exports = ApiKeysService;