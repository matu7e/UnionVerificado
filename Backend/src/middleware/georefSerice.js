
const axios = require('axios');

// URL base de la API desde las variables de entorno
const BASE_URL = process.env.API_BASE_URL;

async function getProvinciaById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/provincias`, {
      params: { id },
    });
    return response.data.provincias[0];
  } catch (err) {
    console.error('Error al obtener provincia:', err.message);
    throw err;
  }
}

async function getLocalidadByID(id) {
  try {
    const response = await axios.get(`${BASE_URL}/localidades`, {
      params: {
        id,
        campos: 'id,nombre,provincia.id',
      },
    });
    return response.data.localidades.map(localidad => ({
      id: localidad.id,
      nombre: localidad.nombre,
      provincia: localidad.provincia.id,
    }));
  } catch (err) {
    console.error('Error al obtener localidad:', err.message);
    throw err;
  }
}

async function getLocalidadesPorProvincia(req, res) {
  const { id_provincia } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/localidades`, {
      params: {
        provincia: id_provincia,
        campos: 'id,nombre',
        max: 600,
      },
    });
    const localidades = response.data.localidades.map(localidad => ({
      id: localidad.id,
      nombre: localidad.nombre,
    }));

    localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return res.json(localidades);
  } catch (err) {
    console.error('Error al obtener las localidades: ', err.message);
    return res.status(500).json({ error: 'Error al obtener las localidades' });
  }
}

async function getProvincias(req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/provincias`, {
      params: { campos: 'id,nombre' },
    });
    const provincias = response.data.provincias;

    provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return res.json(provincias);
  } catch (err) {
    console.error('Error al obtener las provincias: ', err.message);
    return res.status(500).json({ error: 'Error al obtener las provincias' });
  }
}

module.exports = {
  getProvinciaById,
  getLocalidadByID,
  getLocalidadesPorProvincia,
  getProvincias,
};
