const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Miembro = require('../models/miembros');
const transporter = require('../middleware/mailer');

const JWT_SECRET = 'AnalistasNoIngenieros';

async function obtenerTodos(req, res) {
    try{    
        const miembros = await Miembro.getMiembros();
        res.json(miembros);
    } catch (err){
        res.status(500).send('Error al obtener miembros');
    }
}

async function obtenerByDni(req, res) {
    try{
        const dni = req.params.dni;    
        const miembros = await Miembro.getBydni(dni);
        res.json(miembros);
    } catch (err){
        res.status(500).send('Error al obtener miembros');
    }
}

async function registrarMiembro(req, res) {
    const datosMiembro = req.body;
    try{
        const miembroExistente = await Miembro.getBydni(datosMiembro.dni);
        if (miembroExistente) {
            return res.status(409).send('El miembro con este DNI ya existe');
        }
        
        // Generar el hash de la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(datosMiembro.password, salt);
 
        // Reemplazar la contraseña original con la hasheada
        datosMiembro.password = hashedPassword;
        await Miembro.crearMiembro(datosMiembro);

        res.status(201).send('Se registro al miembro exitosamente');
    } catch (err){
        res.status(500).send('Problemas para registrar el miembro');
    }
    
}
async function asignarEscuela(req, res) {
    const dni_miembro = req.params.dni;
    const escuela = req.params.id_escuela;
    try{
        await Miembro.asignarEscuela(dni_miembro, escuela);
        res.send('Escuela asignada con exito')
    } catch (err){
        res.status(500).send('No se pudo asignar la escuela');
    }
    
}

async function loginMiembro(req, res) {
    const { dni, password } = req.body;

    try {
        const miembro = await Miembro.getLogin(dni);
        if (!miembro) {
            return res.status(404).send('El dni o la contraseña son incorrectos');
        }
        
        // Comparar la contraseña ingresada con el hash almacenado        
        const esValida = await bcrypt.compare(password, miembro.password);

        if (!esValida) {
            return res.status(401).send('El dni o la contraseña son incorrectos');
        }
        const token = jwt.sign({ dni: miembro.dni_miembro, rol: miembro.rol, estado: miembro.activo }, JWT_SECRET, { expiresIn: '2h' }); 

        res.status(200).json({token});
        
    } catch (err) {
        res.status(500).send('Problemas en el inicio de sesión');
    }
}


async function actualizarMiembro(req, res) {
    const dni = req.params.dni; // Obtener el DNI de los parámetros de la ruta
    const datosMiembro = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        await Miembro.updateMember(dni, datosMiembro);
        
        res.status(200).send('Miembro actualizado correctamente');
    } catch (err) {
        console.error('Error al actualizar miembro:', err);
        res.status(500).send('Error al actualizar miembro');
    }
}

async function cargarImagen(req, res) {
    const dni_miembro = req.params.dni_miembro;
    const imagen = req.file;

    if (!imagen) {
        return res.status(400).send('No se ha proporcionado una imagen');
      }
    try{
        // 1. Obtener la ruta de la imagen anterior del miembro
        const miembro = await Miembro.getBydni(dni_miembro);
        const imagenAntigua = miembro.imagen; // Campo 'imagen' en la base de datos

        // 2. Eliminar la imagen anterior si existe
        if (imagenAntigua && fs.existsSync(imagenAntigua)) {
            fs.unlinkSync(path.resolve(imagenAntigua));
        }
        const ruta_imagen = imagen.path;
        await Miembro.cargaImagen(dni_miembro, ruta_imagen);
        res.status(200).send('Imagen cargada con exito');
    } catch(err) {
        res.status(500).send('Problemas con la carga de imagen');
    }    
}

async function cargarFichaMedica(req, res) {
    const dni_miembro = req.params.dni_miembro;
    const ficha_medica = req.file;

    if (!ficha_medica) {
        return res.status(400).send('No se ha proporcionado una ficha médica');
      }

    try{
        // 1. Obtener la ruta de la ficha anterior del miembro
        const miembro = await Miembro.getBydni(dni_miembro);
        const fichaAntigua = miembro.ficha_medica;

        // 2. Eliminar la ficha anterior si existe
        if (fichaAntigua && fs.existsSync(fichaAntigua)) {
            fs.unlinkSync(path.resolve(fichaAntigua));
        }
        
        const ruta_ficha = ficha_medica.path;
        await Miembro.cargaFichaMedica(dni_miembro, ruta_ficha);
        res.status(200).send('Ficha medica cargada con exito');
    } catch(err) {
        res.status(500).send('Problemas con la carga de ficha medica');
    }
}

async function buscarMiembros(req, res) {
    const { dni_miembro, id_cinto, apellido, id_escuela, nombre, estado } = req.query;

    try {
        const miembros = await Miembro.buscarMiembros({
            dni_miembro: dni_miembro ? parseInt(dni_miembro) : null,
            id_cinto: id_cinto ? parseInt(id_cinto) : null, 
            apellido: apellido || null,
            id_escuela: id_escuela ? parseInt(id_escuela) : null,
            nombre: nombre || null,
            estado: estado !== undefined ? parseInt(estado) : null // Verifica si estado está definido
        });

        if (miembros.length === 0) {
            return res.status(404).send("No se encontraron miembros con los filtros proporcionados.");
        }

        return res.status(200).json(miembros);
    } catch (err) {
        console.error("Error en la búsqueda de miembros: ", err);
        return res.status(500).send("Hubo un problema al buscar los miembros.");
    }
}

async function subirPrivilegios(req, res) {
    const { dni_miembro } = req.params; // Tomamos el dni_miembro desde los parámetros de la ruta

    try {
        const resultado = await Miembro.subirPrivilegios(dni_miembro);

        if (resultado === 0) {
            return res.status(404).send("No se encontró el miembro con ese ID.");
        }

        return res.status(200).send("Privilegios actualizados correctamente.");
    } catch (err) {
        console.error("Error al subir privilegios: ", err);
        return res.status(500).send("Hubo un problema al actualizar los privilegios del miembro.");
    }
}

async function bajarPrivilegios(req, res) {
    const { dni_miembro } = req.params; // Tomamos el dni_miembro desde los parámetros de la ruta
  
    try {
      const resultado = await Miembro.bajarPrivilegios(dni_miembro);
  
      if (resultado === 0) {
        return res.status(404).send("No se encontró el miembro con ese ID.");
      }
  
      return res.status(200).send("Privilegios reducidos correctamente.");
    } catch (err) {
      console.error("Error al bajar privilegios: ", err);
      return res.status(500).send("Hubo un problema al actualizar los privilegios del miembro.");
    }
  }
    

async function eliminarMiembro(req, res) {
    const { dni_miembro } = req.params;

    try {

        
        // Verificamos si el miembro existe
        const miembro = await Miembro.getBydni(dni_miembro);
        if (!miembro) {
            return res.status(404).send(`No se encontró un miembro con el DNI ${dni_miembro}`);
        }

        // 1. Obtener la ruta de la imagen anterior del miembro
        const imagenAntigua = miembro.imagen; // Campo 'imagen' en la base de datos
        
        // 2. Eliminar la imagen anterior si existe
         if (imagenAntigua && fs.existsSync(imagenAntigua)) {
            fs.unlinkSync(path.resolve(imagenAntigua));
        }

        // Si existe, procedemos a eliminar
        const resultado = await Miembro.eliminarMiembro(dni_miembro);

        

        res.status(200).send(`Miembro con DNI ${dni_miembro} eliminado correctamente`);
    } catch (err) {
        console.error("Error al eliminar miembro: ", err);
        res.status(500).send("Hubo un error al eliminar el miembro");
    }
}

async function actualizarMiembroCompleto(req, res) {
    const { dni } = req.params;
    const miembro = req.body;
  
    try {
      const actualizado = await Miembro.actualizarMiembroCompleto(dni, miembro);
      if (!actualizado) {
        return res.status(404).send("Miembro no encontrado.");
      }
      res.status(200).send("Datos del miembro actualizados completamente.");
    } catch (err) {
      console.error("Error en la actualización completa: ", err);
      res.status(500).send("No se pudieron actualizar los datos del miembro.");
    }
  }

async function solicitarCambioPassw(req, res) {
    const { dni } = req.body;

    try {
        // Verificar si el miembro existe
        const miembro = await Miembro.getBydni(dni);
        if (!miembro) {
            return res.status(404).send('El miembro con este DNI no existe');
        }

        // Crear un token para el cambio de contraseña
        const token = jwt.sign({ dni: miembro.dni_miembro, rol: miembro.rol}, JWT_SECRET, { expiresIn: '1h' }); 
       // const token = jwt.sign({ dni }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expira en 1 hora
        const enlace = `http://127.0.0.7:5501/Frontend/src/cambiarContrasena.html?token=${token}`;
        ;

        // Configurar el correo
        const mailOptions = {
            from: 'Union Mediterranea <unionTDK@gmail.com>',
            to: miembro.email,
            subject: 'Solicitud de cambio de contraseña',
            html: `<p>Hola ${miembro.nombre} ${miembro.apellido},</p>
                   <p>Has solicitado cambiar tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                   <a href="${enlace}">Cambiar contraseña</a>
                   <p>Este enlace expirará en 1 hora.</p>`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).send('Se envió un correo para el cambio de contraseña');
    } catch (err) {
        console.error('Error al enviar correo:', err);
        res.status(500).send('Hubo un problema al procesar la solicitud');
    }
}

async function cambioPassw(req, res) {
    const { token, nuevaContrasena } = req.body;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        const dni = decoded.dni;

        // Generar el hash de la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar la contraseña
        await Miembro.actualizarContrasena(dni, hashedPassword);

        res.status(200).send('Contraseña actualizada exitosamente');
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).send('El enlace ha expirado');
        }
        console.error('Error al cambiar contraseña:', err);
        res.status(500).send('Hubo un problema al cambiar la contraseña');
    }
}

// Controlador: Obtener datos básicos por DNI
async function obtenerDatosBasicosByDni(req, res) {
    try {
        const dni = req.params.dni;
        const miembro = await Miembro.getByDniBasicos(dni); // Llamar a la nueva función

        if (!miembro) {
            return res.status(404).json({ message: 'No se encontró el miembro con ese DNI.' });
        }

        res.json(miembro);
    } catch (err) {
        console.error('Error al obtener datos básicos del miembro:', err);
        res.status(500).send('Hubo un error al obtener los datos básicos del miembro.');
    }
}

module.exports = { obtenerDatosBasicosByDni };

module.exports = { obtenerTodos, registrarMiembro, 
                    asignarEscuela, loginMiembro, 
                    obtenerByDni, actualizarMiembro, 
                    cargarFichaMedica, cargarImagen, 
                    buscarMiembros, subirPrivilegios, 
                    eliminarMiembro, actualizarMiembroCompleto,
                    bajarPrivilegios, solicitarCambioPassw,
                    cambioPassw, obtenerDatosBasicosByDni}