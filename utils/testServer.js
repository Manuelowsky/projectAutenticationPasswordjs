//Server el cual su única mision es levantar un server para pruebas

/*
    mocha: nos ayuda a correr los test
    supertest: levanta un servidor temporal
    sinon: crea mocks para tests
    proxyquire inyecta los mocks cuando se requieren los paquetes
*/

const express = require('express');
//Supertest levanta un servidor temporal
const supertest = require('supertest');

function testServer(route) {
    const app = express();
    route(app);
    return supertest(app);
}

module.exports = testServer;