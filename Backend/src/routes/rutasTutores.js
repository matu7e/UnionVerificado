const express = require('express');
const router = express.Router();
const tutoresController = require('../controllers/tutoresController');
const {validarAdministrador, validarInstructor, validarMiembro} = require('../middleware/authToken');

router.get('/', validarAdministrador, tutoresController.getAll);
router.get('/:dni_tutor',validarMiembro , tutoresController.getByDni);
router.post('/', tutoresController.create);
router.put('/:dni_tutor',validarMiembro ,tutoresController.update);
router.delete('/:dni_tutor',validarAdministrador,  tutoresController.remove);
router.put('/:dni_tutor/completo',validarInstructor , tutoresController.updateCompleto);

module.exports = router;
