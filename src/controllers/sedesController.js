const Sede = require('../models/sedes');
const Localidades = require('../models/localidades');
const geoRef = require('../middleware/georefSerice');

async function getAll(req, res) {
    try {
        const sedes = await Sede.getAllSedes();
        res.status(200).json(sedes);
    } catch (err) {
        console.error('Error al obtener las sedes:', err);
        res.status(500).send('Error al obtener las sedes');
    }
}

async function getByLocalidad(req, res) {
    const localidad = req.params.id_localidad;
    try{
        const sedes = await Sede.getSedesByLocalidad(localidad);
        if(!sedes || sedes.length === 0){
            return res.status(404).send("No hay sedes en esa localidad");
        }
        return res.status(200).json(sedes);
    } catch(err){
        res.status(500).send("Problemas al obtener Sedes: ", err);
    }

    
}
async function getById(req, res) {
    const { id_sede } = req.params;
    try {
        const sede = await Sede.getSedeById(id_sede);
        if (!sede) {
            return res.status(404).send('Sede no encontrada');
        }
        res.status(200).json(sede);
    } catch (err) {
        console.error('Error al obtener la sede:', err);
        res.status(500).send('Error al obtener la sede');
    }
}

async function create(req, res) {
    const sedeData = req.body;

    try {
        const localidad = await Localidades.getByID(sedeData.localidad.id);

        // Si no existe, guardar la localidad
        if (!localidad) {
            //const nuevaLocalidad = await geoRef.getLocalidadByID(sedeData.localidad);
            await Localidades.createLocalidad(sedeData.localidad);
        }

        await Sede.createSede(sedeData);
        res.status(201).send('Sede creada con éxito');
    } catch (err) {
        console.error('Error al crear la sede:', err);
        res.status(500).send('Error al crear la sede');
    }
}

// Actualizar una sede
async function update(req, res) {
    const { id_sede } = req.params;
    const datosSede = req.body;

    try {
        const sedeExistente = await Sede.getSedeById(id_sede);
        if (!sedeExistente) {
            return res.status(404).send('Sede no encontrada');
        }

        await Sede.updateSede(id_sede, datosSede);
        res.status(200).send('Sede actualizada con éxito');
    } catch (err) {
        console.error('Error al actualizar la sede:', err);
        res.status(500).send('Error al actualizar la sede');
    }
}

// Eliminar una sede
async function remove(req, res) {
    const { id_sede } = req.params;

    try {
        const sedeExistente = await Sede.getSedeById(id_sede);
        if (!sedeExistente) {
            return res.status(404).send('Sede no encontrada');
        }

        await Sede.deleteSede(id_sede);
        res.status(200).send('Sede eliminada con éxito');
    } catch (err) {
        console.error('Error al eliminar la sede:', err);
        res.status(500).send('Error al eliminar la sede');
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByLocalidad
};
