//Importando el archivo de lib mongo, que contiene los metodos de mongo.
const MongoLib = require('../lib/mongo');
//Importando bcrypt
const bcrypt = require('bcrypt');

//Servicio que tiene lógica de negocio
class UsersService {
    constructor() {
        //Nombre de nuestra coleccion
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }

    //Funcion para obtener un usuario
    async getUser({ email }) {
        const [user] = await this.mongoDB.getAll(this.collection, { email });
        return user;
    }

    //Funcion para crear el usuario
    async createUser({ user }) {
        const { name, email, password } = user;
        //Encriptando contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const createUserId = await this.mongoDB.create(this.collection, {
            name,
            email,
            password: hashedPassword
        });

        return createUserId;
    }

    /*
        Implementando nuestra ruta para que cualquier proveedor tercero, como por ejemplo
        la autenticación con google, pueda hacer uso de nuestra api.
    */
    async getOrCreateUser({ user }) {
        const queriedUser = await this.getUser({ email: user.email });

        //Si existe el usuario lo devuelve
        if (queriedUser) {
            return queriedUser;
        }

        //Si no existe el usuario lo crea
        await this.createUser({ user });

        //Una vez lo cree, lo devuelve
        return await this.getUser({ email: user.email });
    }

}

//Exportando servicio
module.exports = UsersService;