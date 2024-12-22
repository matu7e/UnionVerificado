const { sql } = require('./../config/bdHelper');

// Crear un nuevo miembro
async function crearMiembro(miembro) {
  const { dni, Nombre, Apellido, FechaNacimiento, GrupoSanguineo, Telefono, Email, Direccion, TutorID, relacion_tutor, password } = miembro;
  const fecha = new Date();
      try {
      await sql.query`
        INSERT INTO Miembros (dni_miembro, nombre, apellido, fecha_nacimiento, grupo_sanguineo, 
                              telefono, email, direccion, dni_tutor, relacion_tutor, 
                              id_escuela, id_cinto, id_rol, activo, password, fecha_alta)
        VALUES (${dni}, ${Nombre}, ${Apellido}, ${FechaNacimiento}, ${GrupoSanguineo}, ${Telefono}, ${Email}, ${Direccion}, ${TutorID}, ${relacion_tutor},null, 1, 1, 0, ${password}, ${fecha})
        `;

      console.log('Miembro creado correctamente.');
    } catch (err) {
      console.error('Error al crear miembro:', err);
    }
  }

// Leer todos los miembros
async function getMiembros() {
    try {
      const result = await sql.query`SELECT m.dni_miembro, m.nombre, m.apellido, m.telefono, m.email, 
        m.fecha_nacimiento, m.grupo_sanguineo, m.direccion, m.imagen, m.fecha_alta, m.activo,
    m.ficha_medica,
    r.descripcion AS rol,
    c.descripcion AS cinto,
    e.nombre AS escuela,
    m.dni_tutor,
    m.relacion_tutor
  FROM 
    Miembros m
  LEFT JOIN 
    Roles r ON m.id_rol = r.id_rol
  LEFT JOIN 
    Cintos c ON m.id_cinto = c.id_cinto
  LEFT JOIN
    Escuelas e ON m.id_escuela = e.id_escuela`;
      return result.recordset;
    } catch (err) {
      console.error('Error al obtener miembros:', err);
    }
  }

async function updateMember(dni, miembro) {
    const { telefono, email, direccion, dni_tutor, id_escuela, id_cinto} = miembro;
    try {
      await sql.query`
        UPDATE Miembros 
        SET 
        telefono = ${telefono}, 
        email = ${email}, 
        direccion = ${direccion}, 
        dni_tutor = ${dni_tutor}, 
        id_escuela = ${id_escuela}, 
        id_cinto = ${id_cinto}
        WHERE dni_miembro = ${dni}
      `;
      console.log('Miembro actualizado correctamente.');
    } catch (err) {
      console.error('Error al actualizar miembro:', err);
    }
  }

  async function asignarEscuela(dni, escuela_id) {
    const escuela = escuela_id;
    const miembro = dni;
    try{  
      await sql.query`
      UPDATE Miembros SET id_escuela = ${escuela} WHERE dni = ${miembro}
      `;
    console.log('Escuela asignada con exito');
    } catch (err){
      console.error('Error al asignar la escuela: ', err)
    }
    
  }
  
// Eliminar un miembro
async function eliminarMiembro(id) {
    try {
      await sql.query`UPDATE Miembros SET activo = 0 WHERE dni_miembro = ${id}`;
      console.log('Miembro eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar miembro:', err);
    }
  }

  async function getBydni(dni) {
    try {
        const result = await sql.query`SELECT m.dni_miembro, m.nombre, m.apellido, m.telefono, m.email, 
        m.fecha_nacimiento, m.grupo_sanguineo, m.direccion, m.imagen, m.fecha_alta, m.activo,
    m.ficha_medica,
    r.descripcion AS rol,
    c.descripcion AS cinto,
    e.nombre AS escuela,
    m.dni_tutor,
    m.relacion_tutor
  FROM 
    Miembros m
  LEFT JOIN 
    Roles r ON m.id_rol = r.id_rol
  LEFT JOIN 
    Cintos c ON m.id_cinto = c.id_cinto
  LEFT JOIN
    Escuelas e ON m.id_escuela = e.id_escuela
  WHERE dni_miembro = ${dni}`;

        // Verificar si la consulta devolvió algún resultado
        if (!result || result.recordset.length === 0) {
            console.log('No existe miembro con ese dni');
            return null;
        }
        return result.recordset[0];  // Retornar el primer resultado
    } catch (err) {
        console.error('Hubo un error al obtener el miembro:', err);
        throw err;
    }
}

async function getLogin(dni) {
  try {
      const result = await sql.query`SELECT m.dni_miembro, m.activo, r.descripcion AS rol, m.password 
      FROM Miembros m LEFT JOIN Roles r ON m.id_rol = r.id_rol
      WHERE dni_miembro = ${dni}`;

      // Verificar si la consulta devolvió algún resultado
      if (!result || result.recordset.length === 0) {
          console.log('Usuario incorrecto');
          return null;
      }
      return result.recordset[0];  // Retornar el primer resultado
  } catch (err) {
      console.error('Error en base de datos:', err);
      throw err;
  }
}

  async function cargaImagen(dni, ruta) {
    try{
      await sql.query`UPDATE Miembros SET imagen = ${ruta} WHERE dni_miembro = ${dni}`;
      console.log('Ruta de imagen cargada correctamente')
    } catch(err){
      console.error('Error al cargar la ruta: ', err)
    }
  }

  async function cargaFichaMedica(dni, ruta) {
    try{
      await sql.query`UPDATE Miembros SET ficha_medica = ${ruta} WHERE dni_miembro = ${dni}`;
      console.log('Ficha medica cargada con exito')
    } catch(err){
      console.error('Error al cargar la ficha medica: ', err)
    }
  }


  async function buscarMiembros({ dni_miembro, id_cinto, apellido, id_escuela, nombre, estado }) {
    let query = `SELECT m.dni_miembro, m.nombre, m.apellido, m.telefono, m.email, 
      m.fecha_nacimiento, m.grupo_sanguineo, m.direccion, m.imagen, m.fecha_alta, m.activo,
      m.ficha_medica,
      r.descripcion AS rol,
      c.descripcion AS cinto,
      e.nombre AS escuela,
      m.dni_tutor,
      m.relacion_tutor
    FROM 
    Miembros m
    LEFT JOIN 
    Roles r ON m.id_rol = r.id_rol
    LEFT JOIN 
    Cintos c ON m.id_cinto = c.id_cinto
    LEFT JOIN
    Escuelas e ON m.id_escuela = e.id_escuela WHERE 1=1`; // Usamos 1=1 para facilitar agregar condiciones
    const request = new sql.Request();

    // Agregamos los parámetros a la consulta solo si no son null
    if (dni_miembro) {
      query += ` AND m.dni_miembro = @dni_miembro`;
      request.input('dni_miembro', sql.Int, dni_miembro); // Asegúrate de usar el tipo correcto
  }
    if (id_cinto) {
        query += ` AND m.id_cinto = @id_cinto`;
        request.input('id_cinto', sql.Int, id_cinto); // Asegúrate de usar el tipo correcto
    }

    if (apellido) {
        query += ` AND m.apellido LIKE '%' + @apellido + '%'`; // Usamos LIKE para búsqueda parcial
        request.input('apellido', sql.VarChar, apellido);
    }

    if (id_escuela) {
        query += ` AND m.id_escuela = @id_escuela`;
        request.input('id_escuela', sql.Int, id_escuela);
    }

    if (nombre) {
      query += ` AND m.nombre LIKE '%' + @nombre + '%'`;
      request.input('nombre', sql.VarChar, nombre); // Asegúrate de usar el tipo correcto
  }
  if (estado == 1 || estado == 0) {
    query += ` AND m.activo = @estado`;
    request.input('estado', sql.Bit, estado); // El tipo de dato BIT
}

    try {
        const result = await request.query(query);
        return result.recordset; // Devolvemos los resultados de la consulta
    } catch (err) {
        console.error("Error al buscar Miembros: ", err);
        throw new Error("Error en la búsqueda de miembros");
    }
}

async function getByEscuela(id_escuela) {
  try {
      const result = await sql.query`SELECT m.dni_miembro, m.nombre, m.apellido, m.telefono, m.email, 
      m.fecha_nacimiento, m.grupo_sanguineo, m.direccion, m.imagen, m.fecha_alta, m.activo,
      m.ficha_medica,
      r.descripcion AS rol,
      c.descripcion AS cinto,
      e.nombre AS escuela,
      m.dni_tutor,
      m.relacion_tutor
    FROM 
    Miembros m
    LEFT JOIN 
    Roles r ON m.id_rol = r.id_rol
    LEFT JOIN 
    Cintos c ON m.id_cinto = c.id_cinto
    LEFT JOIN
    Escuelas e ON m.id_escuela = e.id_escuela
    WHERE m.id_escuela = ${id_escuela}`;

      // Verificar si la consulta devolvió algún resultado
      if (!result || result.recordset.length === 0) {
          console.log('No existen miembros en esa escuela');
          return null;
      }
      return result.recordset[0];  // Retornar el primer resultado
  } catch (err) {
      console.error('Hubo un error al obtener los miembros:', err);
      throw err;
  }
}

async function subirPrivilegios(id_miembro) {
  try {
      const request = new sql.Request();
      const query = `
          UPDATE Miembros
          SET id_rol = @id_rol
          WHERE dni_miembro = @id_miembro
      `;

      request.input('id_miembro', sql.Int, id_miembro);
      request.input('id_rol', sql.Int, 2); // El valor 2 para el nuevo rol

      const result = await request.query(query);
      return result.rowsAffected[0]; // Devuelve la cantidad de filas afectadas
  } catch (err) {
      console.error("Error al actualizar los privilegios: ", err);
      throw new Error("Error al subir privilegios del miembro.");
  }
}

async function bajarPrivilegios(id_miembro) {
  try {
    const request = new sql.Request();
    const query = `
        UPDATE Miembros
        SET id_rol = @id_rol
        WHERE dni_miembro = @id_miembro
    `;

    request.input('id_miembro', sql.Int, id_miembro);
    request.input('id_rol', sql.Int, 1); // El valor 1 para el rol básico

    const result = await request.query(query);
    return result.rowsAffected[0]; // Devuelve la cantidad de filas afectadas
  } catch (err) {
    console.error("Error al bajar los privilegios: ", err);
    throw new Error("Error al bajar privilegios del miembro.");
  }
}


async function actualizarMiembroCompleto(dni_miembro, miembro) {
  const query = `
    UPDATE Miembros
    SET nombre = @nombre,
        apellido = @apellido,
        telefono = @telefono,
        email = @email,
        fecha_nacimiento = @fecha_nacimiento,
        grupo_sanguineo = @grupo_sanguineo,
        direccion = @direccion,
        fecha_alta = @fecha_alta,
        activo = @activo,
        id_cinto = @id_cinto,
        id_escuela = @id_escuela,
        dni_tutor = @dni_tutor,
        relacion_tutor = @relacion_tutor,
        id_rol = @id_rol
    WHERE dni_miembro = @dni_miembro
  `;

  const request = new sql.Request();
  request.input('dni_miembro', sql.Int, dni_miembro);
  request.input('nombre', sql.VarChar, miembro.nombre);
  request.input('apellido', sql.VarChar, miembro.apellido);
  request.input('telefono', sql.BigInt, miembro.telefono);
  request.input('email', sql.VarChar, miembro.email);
  request.input('fecha_nacimiento', sql.Date, miembro.fecha_nacimiento);
  request.input('grupo_sanguineo', sql.VarChar, miembro.grupo_sanguineo);
  request.input('direccion', sql.VarChar, miembro.direccion);
  request.input('fecha_alta', sql.Date, miembro.fecha_alta);
  request.input('activo', sql.Bit, miembro.activo);
  request.input('id_cinto', sql.Int, miembro.id_cinto);
  request.input('id_escuela', sql.Int, miembro.id_escuela);
  request.input('dni_tutor', sql.Int, miembro.dni_tutor);
  request.input('relacion_tutor', sql.VarChar, miembro.relacion_tutor);
  request.input('id_rol', sql.Int, miembro.id_rol);

  try {
    const result = await request.query(query);
    return result.rowsAffected[0]; // Retorna el número de filas afectadas
  } catch (err) {
    console.error("Error al actualizar completamente el miembro: ", err);
    throw new Error("No se pudo actualizar el miembro");
  }
}

async function actualizarContrasena(dni, nuevaContrasena) {
  try {
      await sql.query`
          UPDATE Miembros 
          SET password = ${nuevaContrasena} 
          WHERE dni_miembro = ${dni}`;
      console.log('Contraseña actualizada correctamente');
  } catch (err) {
      console.error('Error al actualizar la contraseña:', err);
      throw err; // Lanza el error para que el controlador lo gestione
  }
}

async function getByDniBasicos(dni) {
  try {
      const result = await sql.query`
      SELECT 
          m.nombre, 
          m.apellido, 
          m.fecha_nacimiento, 
          c.descripcion AS cinto, 
          e.nombre AS escuela, 
          m.grupo_sanguineo,
          m.activo
      FROM 
          Miembros m
      LEFT JOIN 
          Cintos c ON m.id_cinto = c.id_cinto
      LEFT JOIN
          Escuelas e ON m.id_escuela = e.id_escuela
      WHERE 
          m.dni_miembro = ${dni}`;

      // Verificar si la consulta devolvió algún resultado
      if (!result || result.recordset.length === 0) {
          console.log('No existe miembro con ese dni');
          return null;
      }
      return result.recordset[0];  // Retornar el primer resultado
  } catch (err) {
      console.error('Hubo un error al obtener el miembro (datos básicos):', err);
      throw err;
  }
}

module.exports = { crearMiembro, 
  getMiembros, 
  updateMember, 
  eliminarMiembro, 
  asignarEscuela, 
  getBydni, 
  getLogin,
  cargaImagen, 
  cargaFichaMedica, 
  buscarMiembros, 
  getByEscuela,
  subirPrivilegios,
  bajarPrivilegios,
  actualizarMiembroCompleto,
  actualizarContrasena,
  getByDniBasicos
};
