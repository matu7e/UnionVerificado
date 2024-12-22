const { sql } = require('../config/bdHelper');

// Obtener todos los tutores
async function getAllTutores() {
  try {
    const result = await sql.query`SELECT * FROM Tutores`;
    return result.recordset;
  } catch (err) {
    console.error('Error al obtener tutores:', err);
    throw err;
  }
}

// Obtener un tutor por su DNI
async function getTutorByDni(dni_tutor) {
  try {
    const result = await sql.query`SELECT * FROM Tutores WHERE dni_tutor = ${dni_tutor}`;
    if (!result || result.recordset.length === 0) {
      return null;
  }
    return result.recordset[0];
  } catch (err) {
    console.error('Error al obtener tutor:', err);
    throw err;
  }
}

// Crear un nuevo tutor
async function createTutor(tutor) {
    const { dni_tutor, nombre, apellido, telefono } = tutor;
    try {
      await sql.query`
      INSERT INTO Tutores (dni_tutor, nombre, apellido, telefono)
      VALUES (${dni_tutor}, ${nombre}, ${apellido}, ${telefono});
    `;
    console.log('Tutor registrado correctamente');
    } catch(err){
      console.log('Error al registrar tutor: ', err);
    }
  }

// Actualizar un tutor por su DNI
async function updateTutor(dni_tutor, tutor) {
  const { nombre, apellido, telefono } = tutor;
  try {
    await sql.query`
      UPDATE Tutores
      SET nombre = ${nombre}, apellido = ${apellido}, telefono = ${telefono}
      WHERE dni_tutor = ${dni_tutor}
    `;
    console.log('Tutor actualizado correctamente.');
  } catch (err) {
    console.error('Error al actualizar tutor:', err);
    throw err;
  }
}

// Eliminar un tutor por su DNI
async function deleteTutor(dni_tutor) {
  try {
    await sql.query`DELETE FROM Tutores WHERE dni_tutor = ${dni_tutor}`;
    console.log('Tutor eliminado correctamente.');
  } catch (err) {
    console.error('Error al eliminar tutor:', err);
    throw err;
  }
}

// Actualizar un tutor existente
async function actualizarTutorCompleto(dni_tutor_anterior, tutor) {
  const query = `
    UPDATE Tutores
    SET dni_tutor = @dni_tutor,
        nombre = @nombre,
        apellido = @apellido,
        telefono = @telefono
    WHERE dni_tutor = @dni_tutor_anterior
  `;

  const request = new sql.Request();
  request.input('dni_tutor_anterior', sql.Int, dni_tutor_anterior);
  request.input('dni_tutor', sql.Int, tutor.dni_tutor);
  request.input('nombre', sql.VarChar, tutor.nombre);
  request.input('apellido', sql.VarChar, tutor.apellido);
  request.input('telefono', sql.BigInt, tutor.telefono);

  try {
    const result = await request.query(query);
    return result.rowsAffected[0]; // Retorna el número de filas afectadas
  } catch (err) {
    console.error('Error al actualizar completamente el tutor:', err);
    throw new Error('No se pudo actualizar el tutor');
  }
}

module.exports = {
  getAllTutores,
  getTutorByDni,
  createTutor,
  updateTutor,
  deleteTutor,
  actualizarTutorCompleto
};
