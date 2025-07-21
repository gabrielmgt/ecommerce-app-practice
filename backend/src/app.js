const express = require('express');
const cors = require('cors');
const app = express();
const cartController = require('./controllers/cartController');

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON

// Routes
// Endpoint POST /api/cart/
app.post('/api/cart', cartController.processCart);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Exporta la app para usarla en server.js
module.exports = app;