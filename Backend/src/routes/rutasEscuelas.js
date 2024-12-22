const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileManager');
const escuelasController = require('../controllers/escuelasController');
const {validarAdministrador, validarInstructor, validarMiembro} = require('../middleware/authToken');

router.get('/', validarMiembro, escuelasController.getAll)
router.post('/',validarInstructor, escuelasController.crearEscuela);
router.put('/:id_escuela',validarInstructor, escuelasController.update);
router.delete('/:id_escuela',validarAdministrador, escuelasController.remove);
router.post('/:id_escuela/cargaLogo',validarInstructor, upload.single('logo'), escuelasController.cargarLogo);
router.get('/instructor/:id_instructor',validarInstructor, escuelasController.getByInstructor);
router.get('/buscar', escuelasController.buscarEscuelas);
router.get('/:id_localidad',validarInstructor, escuelasController.getByLocalidad);


module.exports = router;
