const { sql } = require('../config/bdHelper');

// Obtener todos los cintos
async function getAllCintos() {
  try {
    const result = await sql.query`SELECT * FROM Cintos`;
    return result.recordset;
  } catch (err) {
    console.error('Error al obtener cintos:', err);
    throw err;
  }
}

// Obtener un cinto por su ID
async function getCintoById(id) {
  try {
    const result = await sql.query`SELECT * FROM Cintos WHERE CintoID = ${id}`;
    return result.recordset[0];
  } catch (err) {
    console.error('Error al obtener cinto:', err);
    throw err;
  }
}

module.exports = {
  getAllCintos,
  getCintoById
};
