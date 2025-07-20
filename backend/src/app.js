const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para parsear JSON en las requests

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Exporta la app para usarla en server.js
module.exports = app;