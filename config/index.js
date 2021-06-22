require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    cors: process.env.CORS,
    //MONGODB
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    //AUTH (Definir el secret que usaremos para firmar el JWT, sacar de keygen.io)
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    //USERS (Un password diferente para cada aplicación que estemos creando)
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
    defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
    //API (Estas permiten definir que cuando haya un login le otorge los permisos)
    publicApiKeyToken: process.env.PUBLIC_API_KEY_TOKEN,
    adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN
}

module.exports = { config };