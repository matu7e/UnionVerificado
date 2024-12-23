const express = require('express');
const router = express.Router();
const cintosController = require('../controllers/cintosController');
const {validarAdministrador, validarInstructor, validarMiembro} = require('../middleware/authToken');

// Ruta para obtener todos los cintos
router.get('/', validarMiembro, cintosController.getAll);

// Ruta para obtener un cinto por su ID
router.get('/:id', validarMiembro, cintosController.getById);

module.exports = router;
