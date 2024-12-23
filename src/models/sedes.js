const { sql } = require('../config/bdHelper');

async function getAllSedes() {
    try {
        const result = await sql.query`SELECT s.id_sede, s.direccion, l.nombre AS localidad, e.nombre AS escuela, e.id_escuela
        FROM Sedes s 
        LEFT JOIN Escuelas e ON s.id_escuela = e.id_escuela 
        LEFT JOIN Localidades l ON s.localidadID = l.id_localidad`;
        return result.recordset;
    } catch (err) {
        console.error('Error al obtener las sedes', err);
    }
}

async function getSedesByLocalidad(localidad_id) {
    try{
        const result = await sql.query`SELECT s.direccion, l.nombre AS localidad, e.nombre AS escuela, e.id_escuela
        FROM Sedes s 
        LEFT JOIN Escuelas e ON s.id_escuela = e.id_escuela 
        LEFT JOIN Localidades l ON s.localidadID = l.id_localidad 
        WHERE s.localidadID = ${localidad_id}`;
        
        return result.recordset;
    }   catch(err){
        console.error("Problemas al obtener Sedes por Localidad: ", err);
    }
}

async function getSedeById(id_sede) {
    try {
        const result = await sql.query`
            SELECT s.direccion, l.nombre AS localidad, e.nombre AS escuela, e.id_escuela
            FROM Sedes s 
            LEFT JOIN Escuelas e ON s.id_escuela=e.id_escuela 
            LEFT JOIN Localidades l ON s.localidadID = l.id_localidad 
            WHERE id_sede = ${id_sede}
        `;
        return result.recordset[0]; // Devuelve la sede si existe
    } catch (err) {
        throw new Error('Error al obtener la sede');
    }
}

async function createSede(sede) {
    const {id_escuela, direccion} = sede;
    const id_localidad = sede.localidad.id;

    try {
        await sql.query`
            INSERT INTO Sedes (id_escuela, direccion, localidadID)
            VALUES (${id_escuela}, ${direccion}, ${id_localidad})
        `;
        console.log("Sede registrada correctamente");
    } catch (err) {
        console.error("Error al crear la sede: ", err);
    }
}

async function updateSede(id_sede, sede) {
    const {direccion, id_localidad} = sede;
    try {
        await sql.query`
            UPDATE Sedes
            SET direccion = ${direccion}, localidadID = ${id_localidad}
            WHERE id_sede = ${id_sede}
        `;
    } catch (err) {
        throw new Error('Error al actualizar la sede');
    }
}

// Eliminar una sede
async function deleteSede(id_sede) {
    try {
        await sql.query`
            DELETE FROM Sedes WHERE id_sede = ${id_sede}
        `;
    } catch (err) {
        throw new Error('Error al eliminar la sede');
    }
}

module.exports = {
    getAllSedes,
    getSedeById,
    createSede,
    updateSede,
    deleteSede,
    getSedesByLocalidad
};
