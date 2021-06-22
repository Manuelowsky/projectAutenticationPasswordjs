//Importar joi para definir el esquema
const joi = require('@hapi/joi');

//Esquemas individuales
//Estructura que debe tener el id del usuario (String y Expresion regular)
const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}/)

//Estructura que debe tener el usuario
const userSchema = {
    name: joi.string().max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().required()
}

//Estrcutrua que debe tener el usuario al crearlo desde el body
const createUserSchema = {
    ...userSchema,
    isAdmin: joi.boolean()
}

//Estructura que debe tener el usuario del proveedor al crearlo
const createProviderUserSchema = {
    ...createUserSchema,
    apiKeyToken: joi.string().required()
}

//Exportamos modulos
module.exports = {
    userIdSchema,
    createUserSchema,
    createProviderUserSchema
}