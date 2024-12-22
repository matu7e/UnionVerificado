const { sql } = require('../config/bdHelper');

// Obtener todas las escuelas
async function getAllEscuelas() {
  try {
    const result = await sql.query`
      SELECT e.id_escuela, e.nombre, e.dni_instructor, m.nombre AS nombre_instructor, m.apellido AS apellido_instructor, e.email_escuela, e.telefono_escuela, e.enlace, e.logo_escuela, e.fecha_de_alta
      FROM Escuelas e
      LEFT JOIN Miembros m ON e.dni_instructor = m.dni_miembro
    `;
    return result.recordset;
  } catch (err) {
    console.error('Error al obtener escuelas:', err);
    throw err;
  }
}

// Crear una nueva escuela
async function createEscuela(escuela) {
  const { nombre, dni_instructor, email, telefono, enlace, logo} = escuela;
  const fecha = new Date();
  try {
    const result = await sql.query`
      INSERT INTO Escuelas (nombre, dni_instructor, email_escuela, telefono_escuela, enlace, logo_escuela, fecha_de_alta)
      OUTPUT INSERTED.id_escuela
      VALUES (${nombre}, ${dni_instructor}, ${email}, ${telefono}, ${enlace}, ${logo}, ${fecha})
    `;
    console.log('Escuela creada correctamente.');
    const id_escuela = result.recordset[0].id_escuela; // Capturamos el ID insertado
    return id_escuela;
  } catch (err) {
    console.error('Error al crear escuela:', err);
    throw err;
  }
}

// Actualizar una escuela por su ID
async function updateEscuela(id_escuela, escuela) {
  const { dni_instructor, email, telefono, enlace, nombre} = escuela;
  try {
    await sql.query`
      UPDATE Escuelas
      SET dni_instructor = ${dni_instructor}, email_escuela = ${email}, telefono_escuela = ${telefono},
          enlace = ${enlace}, nombre = ${nombre}
      WHERE id_escuela = ${id_escuela}
    `;
    console.log('Escuela actualizada correctamente.');
  } catch (err) {
    console.error('Error al actualizar escuela:', err);
    throw err;
  }
}

// Eliminar una escuela por su ID
async function eliminarEscuela(id_escuela) {
  try {
    const request = new sql.Request();
    request.input('id_escuela', sql.Int, id_escuela);

    // Llamada al procedimiento almacenado
    const result = await request.execute('EliminarEscuela');

    return result.rowsAffected; // Devuelve un array con las filas afectadas en cada operación del procedimiento
  } catch (err) {
    console.error('Error al eliminar la escuela:', err);
    throw new Error('No se pudo eliminar la escuela.');
  }
}

async function getEscuelaById(id_escuela) {
    try {
        const request = new sql.Request();
        request.input('id_escuela', sql.Int, id_escuela); // id_escuela es de tipo entero

        const result = await request.query(`
            SELECT e.id_escuela, e.nombre, m.nombre AS nombre_instructor, m.apellido AS apellido_instructor, e.email_escuela, e.telefono_escuela, e.enlace, e.logo_escuela, e.fecha_de_alta
            FROM Escuelas e
            LEFT JOIN Miembros m ON e.dni_instructor = m.dni_miembro 
            WHERE e.id_escuela = ${id_escuela}
        `);

        return result.recordset[0]; // Retornamos solo la primera coincidencia
    } catch (err) {
        console.error("Error al obtener la escuela por ID: ", err);
    }
}

async function cargaLogo(id_escuela, ruta) {
  try{
    await sql.query`UPDATE Escuelas SET logo_escuela = ${ruta} WHERE id_escuela = ${id_escuela}`;
    console.log('Logo cargado correctamente')
  } catch(err){
    console.error('Error al cargar la ruta: ', err)
  }
}

async function getByInstructor(id_instructor) {
  try {
      const request = new sql.Request();
      const query = `
          SELECT e.id_escuela, e.nombre, e.dni_instructor, m.nombre AS nombre_instructor, m.apellido AS apellido_instructor, e.email_escuela, e.telefono_escuela, e.enlace, e.logo_escuela, e.fecha_de_alta
          FROM Escuelas e
          LEFT JOIN Miembros m ON e.dni_instructor = m.dni_miembro
          WHERE e.dni_instructor = @id_instructor
      `;

      request.input('id_instructor', sql.Int, id_instructor);

      const result = await request.query(query);
      return result.recordset; // Devuelve las escuelas que coinciden con el id_instructor
  } catch (err) {
      console.error("Error al obtener escuelas por instructor: ", err);
      throw new Error("Error al buscar escuelas por instructor.");
  }
}

async function buscarEscuelas({ id_escuela, id_provincia, id_localidad, nombre_escuela, nombre_instructor, apellido_instructor }) {
  let query = `
      SELECT e.id_escuela, e.nombre AS nombre_escuela, e.enlace, e.telefono_escuela AS telefono, e.logo_escuela, 
             m.nombre AS nombre_instructor, m.apellido AS apellido_instructor,
             s.direccion AS sede_direccion, l.nombre AS localidad,
             p.nombre AS provincia
      FROM Escuelas e
      LEFT JOIN Miembros m ON e.dni_instructor = m.dni_miembro
      LEFT JOIN Sedes s ON e.id_escuela = s.id_escuela
      LEFT JOIN Localidades l ON s.localidadID = l.id_localidad
      LEFT JOIN Provincias p ON l.id_provincia = p.id_provincia
      WHERE 1=1
  `;
  
  const request = new sql.Request();

  // Filtros condicionales
  if (id_provincia) {
      query += ` AND l.id_provincia = @id_provincia`;
      request.input('id_provincia', sql.Int, id_provincia);
  }
  
  if (id_localidad) {
      query += ` AND s.localidadID = @id_localidad`;
      request.input('id_localidad', sql.BigInt, id_localidad);
  }

  if (nombre_escuela) {
      query += ` AND e.nombre LIKE '%' + @nombre_escuela + '%'`;
      request.input('nombre_escuela', sql.VarChar, nombre_escuela);
  }

  if (nombre_instructor) {
      query += ` AND m.nombre LIKE '%' + @nombre_instructor + '%'`;
      request.input('nombre_instructor', sql.VarChar, nombre_instructor);
  }

  if (apellido_instructor) {
      query += ` AND m.apellido LIKE '%' + @apellido_instructor + '%'`;
      request.input('apellido_instructor', sql.VarChar, apellido_instructor);
  }

  if (id_escuela) {
    query += ` AND e.id_escuela = @id_escuela`;
    request.input('id_escuela', sql.Int, id_escuela);
}

  try {
      const result = await request.query(query);
      return result.recordset;
  } catch (err) {
      console.error("Error al buscar Escuelas: ", err);
      throw new Error("Error en la búsqueda de escuelas");
  }
}

module.exports = {
  getAllEscuelas,
  createEscuela,
  updateEscuela,
  eliminarEscuela,
  getEscuelaById,
  cargaLogo,
  getByInstructor,
  buscarEscuelas
};
