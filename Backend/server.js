const app = require('./src/app');
const port = process.env.PORT || 3000;


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
  