const { sql } = require('../config/bdHelper');

// Obtener una provincia por su ID
async function getById(id_provincia) {
  const result = await sql.query`SELECT * FROM Provincias WHERE id_provincia = ${id_provincia}`;
  return result.recordset[0];
}

// Crear una nueva provincia
async function create(provincia, transaction = null) {
  const { id_provincia, nombre } = provincia;
  const query = `
    INSERT INTO Provincias (id_provincia, nombre)
    VALUES (@id_provincia, @nombre);
  `;
  const request = transaction ? new sql.Request(transaction) : sql;

  await request.input('id_provincia', sql.Int, id_provincia)
               .input('nombre', sql.VarChar, nombre)
               .query(query);

  return provincia;
}

module.exports = {
  getById,
  create,
};
