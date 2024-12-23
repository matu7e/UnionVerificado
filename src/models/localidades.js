const { sql } = require('../config/bdHelper');

// Obtener una localidad por id
async function getByID(id) {
  try{
    const result = await sql.query`SELECT * FROM Localidades WHERE id_localidad = ${id}`;

      if (!result || result.recordset.length === 0) {
        console.log('No existe localidad');
        return null;
      }
      return result.recordset[0];
  } catch(err){
    console.error("Error al obtener localidad");
  }

}

// Crear una nueva localidad
async function createLocalidad(localidad) {
  const { id, nombre, provincia } = localidad;
  try {
      await sql.query`
      INSERT INTO Localidades (id_localidad, id_provincia, nombre)
      VALUES (${id}, ${provincia}, ${nombre})
    `;
    console.log("Localidad cargada con exito");
  } catch (err) {
    console.error('Error al crear localidad:', err);
    throw err;
  }
}

module.exports = {
  getByID,
  createLocalidad,
};
