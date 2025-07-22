const express = require('express');
const cors = require('cors');
const app = express();
const cartController = require('./controllers/cartController');

// Middlewares
/*
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN,
    "https://localhost:7001",
    "https://127.0.0.1:7001",
  ],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};*/
//app.use(cors(corsOptions));
app.use(cors({origin: process.env.CORS_ORIGIN}));
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
