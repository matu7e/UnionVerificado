
const jwt = require('jsonwebtoken');

// Clave secreta desde las variables de entorno
const secretKey = process.env.JWT_SECRET;

async function validarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded; // Agrega el payload del token al objeto `req`
    next(); // Si el token es válido, pasa al siguiente middleware o controlador
  } catch (err) {
    console.error('Error al validar el token:', err);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

async function validarAdministrador(req, res, next) {
  await validarToken(req, res, async () => {
    if (req.usuario.rol !== 'Administrador') {
      return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de administrador.' });
    }
    next();
  });
}

async function validarInstructor(req, res, next) {
  await validarToken(req, res, async () => {
    const { rol } = req.usuario;
    if (rol !== 'Instructor' && rol !== 'Administrador') {
      return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de instructor o administrador.' });
    }
    next();
  });
}

async function validarMiembro(req, res, next) {
  await validarToken(req, res, async () => {
    const { rol } = req.usuario;
    if (rol !== 'Alumno' && rol !== 'Instructor' && rol !== 'Administrador') {
      return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de miembro, instructor o administrador.' });
    }
    next();
  });
}

module.exports = { validarAdministrador, validarInstructor, validarMiembro };
