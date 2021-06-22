//Este script inserta los api keys

//set DEBUG=app:* && node scripts/mongo/seedApiKeys.js

/*
    Los API_KEYS se utilizan para consultar a la base de datos los permisos necesarios para 
    cada tipo de usuario y poder generar un JWT.

    -> Cuando se registra un usuario normal se manda el PUBLIC_API_KEY_TOKEN entonces se consultan 
    los permisos en Mongo para esa api key ya que se requiere que ese usuario tenga los permisos 
    “normales”, una vez registrado se crea el JWT y se le asignan esos permisos.

    -> Cuando se registrar un usuario administrador se envía el ADMIN_API_KEY_TOKEN y se consultan 
    los permisos en Mongo para esa api key que como es tipo ADMIN generalmente tiene todos los 
    permisos, una vez registrado se crea el JWT y se le asignan esos permisos.

    En este caso lo que estamos haciendo es definir en nuestras variables de ambiente (env) que sólo 
    permitiremos el acceso a llamadas de la API que estén firmadas con la llave (api_key).

    El api key es una llave que definimos en el servidor para abrir el acceso a nuestro servicio, 
    así, si algún servicio en internet no tiene la llave que estás definiendo, no podrá acceder a 
    tu servicio
*/

const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-keys');
const MongoLib = require('../../lib/mongo');

//Api key admin, tiene acceso a todas las funcionalidades
const adminScopes = [
    'signin:auth',
    'signup:auth',
    'read:movies',
    'create:movies',
    'update:movies',
    'delete:movies',
    'read:user-movies',
    'create:user-movies',
    'delete:user-movies'
];

//Api key publico, tiene acceso restringido a algunas funcionalidades
const publicScopes = [
    'signin:auth',
    'signup:auth',
    'read:movies',
    'read:user-movies',
    'create:user-movies',
    'delete:user-movies'
];

//Aseguramos que cada aplicación tenga unos apitokens diferentes
const apiKeys = [{
        token: generateRandomToken(),
        scopes: adminScopes
    },
    {
        token: generateRandomToken(),
        scopes: publicScopes
    }
];

function generateRandomToken() {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('hex');
}

async function seedApiKeys() {
    try {
        const mongoDB = new MongoLib();

        const promises = apiKeys.map(async apiKey => {
            await mongoDB.create('api-keys', apiKey);
        });

        await Promise.all(promises);
        debug(chalk.green(`${promises.length} api keys have been created succesfully`)); // prettier-ignore
        return process.exit(0);
    } catch (error) {
        debug(chalk.red(error));
        process.exit(1);
    }
}

seedApiKeys();