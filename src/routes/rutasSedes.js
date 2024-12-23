const express = require('express');
const router = express.Router();
const sedesController = require('../controllers/sedesController');
const {validarAdministrador, validarInstructor, validarMiembro} = require('../middleware/authToken');

// Rutas del ABMC de Sedes
router.get('/',validarInstructor, sedesController.getAll);
router.get('/id/:id_sede',validarInstructor , sedesController.getById);
router.post('/',validarInstructor,  sedesController.create);
router.put('/:id_sede',validarInstructor, sedesController.update);
router.delete('/:id_sede',validarInstructor,  sedesController.remove);
router.get('/:id_localidad',validarInstructor, sedesController.getByLocalidad);

module.exports = router;
