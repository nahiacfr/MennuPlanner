const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/menuplanner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB exitosa');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

app.get('/api/suggestions', (req, res) => {
    res.json({ message: 'Here are some recipe suggestions!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
