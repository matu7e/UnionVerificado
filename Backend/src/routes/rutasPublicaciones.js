const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileManager');
const publicacionesController = require('../controllers/publicacionesController');
const {validarAdministrador, validarInstructor, validarMiembro} = require('../middleware/authToken');

// Rutas del ABMC de Publicaciones
router.get('/',validarMiembro, publicacionesController.getAll);
router.get('/:id_publicacion',validarAdministrador, publicacionesController.getById);
router.post('/', validarAdministrador, publicacionesController.crearPublicacion);
router.put('/:id_publicacion',validarAdministrador , publicacionesController.actualizarPublicacion);
router.delete('/:id_publicacion',validarAdministrador , publicacionesController.eliminarPublicacion);
router.post('/:id_publicacion/cargaImagen',validarAdministrador, upload.single('imagen'), publicacionesController.cargarImagen);


                                                                       
module.exports = router;
