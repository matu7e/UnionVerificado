const multer = require('multer');
const path = require('path');

// Configuración de multer para la carpeta 'Uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Guardar con un nombre único
  }
});

// Filtro para permitir solo imágenes y PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' ) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido'), false);
  }
};

// Configuración de multer
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

module.exports = upload;
