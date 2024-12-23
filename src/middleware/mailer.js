
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter
    .verify()
    .then(() => console.log('Transporter configurado correctamente'))
    .catch((err) => console.error('Error al configurar el transporter:', err));

module.exports = transporter;
