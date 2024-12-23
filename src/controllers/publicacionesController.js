const Publicacion = require('../models/publicaciones');
const fs = require('fs');
const path = require('path');


// Crear una nueva publicación
async function crearPublicacion(req, res) {
    const publicacionData = req.body; // Recibe el cuerpo de la solicitud con la información de la publicación

    try {
        const id_pub = await Publicacion.createPublicacion(publicacionData);
        res.status(201).json({ message: 'Publicacion creada con éxito', id_pub });
    } catch (err) {
        console.error('Error al crear la publicación:', err);
        res.status(500).send('Error al crear la publicación');
    }
}

// Obtener todas las publicaciones
async function getAll(req, res) {
    try {
        const publicaciones = await Publicacion.getAllPublicaciones();
        res.status(200).json(publicaciones);
    } catch (err) {
        console.error('Error al obtener las publicaciones:', err);
        res.status(500).send('Error al obtener las publicaciones');
    }
}

// Obtener una publicación por ID
async function getById(req, res) {
    const { id_publicacion } = req.params;

    try {
        const publicacion = await Publicacion.getPublicacionById(id_publicacion);
        if (!publicacion) {
            return res.status(404).send('Publicación no encontrada');
        }
        res.status(200).json(publicacion);
    } catch (err) {
        console.error('Error al obtener la publicación:', err);
        res.status(500).send('Error al obtener la publicación');
    }
}

// Actualizar una publicación
async function actualizarPublicacion(req, res) {
    const { id_publicacion } = req.params;
    const publicacionData = req.body; // Recibe el cuerpo de la solicitud con los datos actualizados

    try {
        const publicacionExistente = await Publicacion.getPublicacionById(id_publicacion);
        if (!publicacionExistente) {
            return res.status(404).send('Publicación no encontrada');
        }

        await Publicacion.updatePublicacion(id_publicacion, publicacionData);
        res.status(200).send('Publicación actualizada con éxito');
    } catch (err) {
        console.error('Error al actualizar la publicación:', err);
        res.status(500).send('Error al actualizar la publicación');
    }
}

// Eliminar una publicación
async function eliminarPublicacion(req, res) {
    const { id_publicacion } = req.params;

    try {
                // 1. Obtener la ruta de la imagen anterior publicacion
                const publ = await Publicacion.getPublicacionById(id_publicacion);
                const imagenAntigua = publ.imagen;
        
                // 2. Eliminar la imagen anterior si existe
                if (imagenAntigua && fs.existsSync(imagenAntigua)) {
                    fs.unlinkSync(path.resolve(imagenAntigua));
                }
        const publicacionExistente = await Publicacion.getPublicacionById(id_publicacion);
        if (!publicacionExistente) {
            return res.status(404).send('Publicación no encontrada');
        }

        await Publicacion.deletePublicacion(id_publicacion);
        res.status(200).send('Publicación eliminada con éxito');
    } catch (err) {
        console.error('Error al eliminar la publicación:', err);
        res.status(500).send('Error al eliminar la publicación');
    }
}

async function cargarImagen(req, res) {
    const id_publ = req.params.id_publicacion;
    const imagen = req.file;

    if (!imagen) {
        return res.status(400).send('No se ha proporcionado una imagen');
      }
    try{
        // 1. Obtener la ruta de la imagen anterior del miembro
        const publ = await Publicacion.getPublicacionById(id_publ);
        const imagenAntigua = publ.imagen;

        // 2. Eliminar la imagen anterior si existe
        if (imagenAntigua && fs.existsSync(imagenAntigua)) {
            fs.unlinkSync(path.resolve(imagenAntigua));
        }
        const ruta_imagen = imagen.path;
        await Publicacion.cargaImagen(id_publ, ruta_imagen);
        res.status(200).send('Imagen cargada con exito');
    } catch(err) {
        res.status(500).send('Problemas con la carga de imagen');
    }
}

module.exports = {
    crearPublicacion,
    getAll,
    getById,
    actualizarPublicacion,
    eliminarPublicacion,
    cargarImagen
};
