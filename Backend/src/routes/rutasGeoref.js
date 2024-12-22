const express = require('express');
const router = express.Router();
const geoRef = require('../middleware/georefSerice');

router.get('/', geoRef.getProvincias);
router.get('/:id_provincia', geoRef.getLocalidadesPorProvincia);

module.exports = router;