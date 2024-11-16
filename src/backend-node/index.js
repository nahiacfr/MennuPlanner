const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB (sin las opciones deprecadas)
mongoose.connect('mongodb://localhost:27017/menuplanner')
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

// Simulación de "base de datos" en memoria para recetas
const recetas = [
    { id: 1, nombre: 'Pasta Carbonara', popularidad: 4 },
    { id: 2, nombre: 'Ensalada César', popularidad: 5 },
    { id: 3, nombre: 'Sopa de Tomate', popularidad: 3 },
    { id: 4, nombre: 'Pizza Margherita', popularidad: 5 },
    { id: 5, nombre: 'Tacos al Pastor', popularidad: 4 }
];

// Endpoint para sugerir recetas
app.get('/api/suggestions', (req, res) => {
    // Filtrar recetas con popularidad >= 4 como sugerencias
    const recetasSugeridas = recetas.filter(receta => receta.popularidad >= 4);
    res.json(recetasSugeridas);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


