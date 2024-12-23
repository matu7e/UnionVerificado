const Cinto = require('../models/cintos');

// Obtener todos los cintos
async function getAll(req, res) {
  try {
    const cintos = await Cinto.getAllCintos();
    res.json(cintos);
  } catch (err) {
    res.status(500).send('Error al obtener cintos');
  }
}

// Obtener un cinto por su ID
async function getById(req, res) {
  const id = req.params.id;
  try {
    const cinto = await Cinto.getCintoById(id);
    if (!cinto) {
      res.status(404).send('Cinto no encontrado');
    } else {
      res.json(cinto);
    }
  } catch (err) {
    res.status(500).send('Error al obtener cinto');
  }
}


module.exports = {
  getAll,
  getById,
};
