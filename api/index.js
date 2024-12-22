const app = require('../backend/src/app'); // Traemos la app de Express
const express = require('express');
const port = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Exportar la función para que Vercel pueda invocarla
module.exports = (req, res) => {
  app(req, res); // Usamos el app de Express para manejar la solicitud
};
