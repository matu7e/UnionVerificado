const Escuela = require('../models/escuelas');
const fs = require('fs');
const path = require('path');

async function crearEscuela(req, res) {
  const escuelaData = req.body;

  try {
    const id_escuela = await Escuela.createEscuela(escuelaData);
    res.status(201).json({ message: 'Escuela creada con éxito', id_escuela });
  } catch (err) {
    console.error('Error al crear escuela:', err);
    res.status(500).send('Error al crear escuela');
  }
}

// Actualizar una escuela
async function update(req, res) {
    const id_escuela = req.params.id_escuela;
    const escuelaData = req.body;
    try {
      await Escuela.updateEscuela(id_escuela, escuelaData);
      res.send('Escuela actualizada con éxito');
    } catch (err) {
      res.status(500).send('Error al actualizar escuela');
    }
  }
  
  // Eliminar una escuela
  async function remove(req, res) {
    const id_escuela = req.params.id_escuela;
    if (!id_escuela) {
      return res.status(400).json({ message: 'El ID de la escuela es obligatorio.' });
    }
  
    try {
            // 1. Obtener la ruta del logo anterior
            const escuela = await Escuela.getEscuelaById(id_escuela);
            const logoAntiguo = escuela.logo_escuela;
      
            // 2. Eliminar la ficha anterior si existe
            if (logoAntiguo && fs.existsSync(logoAntiguo)) {
                fs.unlinkSync(path.resolve(logoAntiguo));
            }
      const filasAfectadas = await Escuela.eliminarEscuela(parseInt(id_escuela, 10));
  
      if (filasAfectadas[2] > 0) { // La tercera operación elimina la escuela
        return res.status(200).json({ message: 'Escuela eliminada correctamente.' });
      } else {
        return res.status(404).json({ message: 'No se encontró la escuela.' });
      }
    } catch (err) {
      console.error('Error al eliminar la escuela:', err);
      return res.status(500).json({ message: 'Hubo un problema al eliminar la escuela.' });
    }
  }
  
  // Obtener una escuela por su ID
async function getByLocalidad(req, res) {
    const id_localidad = req.params.id_localidad;
    try {
      const escuela = await Escuela.getEscuelasByLocalidad(id_localidad)
      if (!escuela) {
        res.status(404).send('No hay escuelas en esa localidad');
      } else {
        res.json(escuela);
      }
    } catch (err) {
      res.status(500).send('Error al obtener escuela');
    }
  }

  async function getAll(req, res) {
    try {
        const sedes = await Escuela.getAllEscuelas();
        res.status(200).json(sedes);
    } catch (err) {
        console.error('Error al obtener las escuelas:', err);
        res.status(500).send('Error al obtener las escuelas');
    }
}

async function cargarLogo(req, res) {
  const id_escuela = req.params.id_escuela;
  const logo = req.file;

  if (!logo) {
      return res.status(400).send('No se ha proporcionado una imagen valida');
    }

  try{
      // 1. Obtener la ruta del logo anterior
      const escuela = await Escuela.getEscuelaById(id_escuela);
      const logoAntiguo = escuela.logo_escuela;

      // 2. Eliminar la ficha anterior si existe
      if (logoAntiguo && fs.existsSync(logoAntiguo)) {
          fs.unlinkSync(path.resolve(logoAntiguo));
      }
      
      const ruta_logo = logo.path;
      await Escuela.cargaLogo(id_escuela, ruta_logo);
      res.status(200).send('Logo cargado con exito');
  } catch(err) {
      res.status(500).send('Problemas con la carga de logo');
  }
}

async function getByInstructor(req, res) {
  const { id_instructor } = req.params; // Tomamos el id_instructor desde los parámetros de la ruta

  try {
      const escuelas = await Escuela.getByInstructor(id_instructor);

      if (escuelas.length === 0) {
          return res.status(404).send("No se encontraron escuelas para ese instructor.");
      }

      return res.status(200).json(escuelas);
  } catch (err) {
      console.error("Error al obtener escuelas por instructor: ", err);
      return res.status(500).send("Hubo un problema al obtener las escuelas.");
  }
}

async function buscarEscuelas(req, res) {
  const { id_escuela, id_provincia, id_localidad, nombre_escuela, nombre_instructor, apellido_instructor } = req.query;

  try {
      const escuelas = await Escuela.buscarEscuelas({
          id_escuela: id_escuela ? parseInt(id_escuela) : null,
          id_provincia: id_provincia ? parseInt(id_provincia) : null,
          id_localidad: id_localidad ? BigInt(id_localidad) : null,
          nombre_escuela: nombre_escuela || null,
          nombre_instructor: nombre_instructor || null,
          apellido_instructor: apellido_instructor || null,
      });

      if (escuelas.length === 0) {
          return res.status(404).send("No se encontraron escuelas con los filtros proporcionados.");
      }

      return res.status(200).json(escuelas);
  } catch (err) {
      console.error("Error en la búsqueda de escuelas: ", err);
      return res.status(500).send("Hubo un problema al buscar las escuelas.");
  }
}


  module.exports = {
    getByLocalidad,
    crearEscuela,
    update,
    remove,
    getAll,
    cargarLogo,
    getByInstructor,
    buscarEscuelas
  };