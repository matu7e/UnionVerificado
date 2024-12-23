const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.get('/pagar/:dni', pagosController.iniciarPago);

// Éxito en el pago
router.get('/success', (req, res, next) => {
  const { monto } = req.query;

  if (!monto) {
    return res.status(400).json({ message: 'El monto es obligatorio.' });
  }

  next(); // Continúa al controlador si los parámetros están presentes
}, pagosController.registrarPago);

  // Fallo en el pago
router.get('/failure', (req, res) => {
    return res.redirect('http://127.0.0.7:5501/Frontend/src/error.html'); // Redirige a la página de error
  });
  
  // Pago pendiente
router.get('/pending', (req, res) => {
    res.status(200).send('Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.');
  });

module.exports = router;