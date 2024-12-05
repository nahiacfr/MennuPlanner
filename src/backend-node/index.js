const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect('mongodb://localhost:27017/menuplanner', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Esquema de usuario utilizando email como identificador único
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email como identificador único
  favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: [] }], // Cambio a ObjectId
  weeklyMenu: {
    type: [
      {
        day: { type: String, required: true }, // Día de la semana
        meals: { type: [String], default: [] }, // Títulos de recetas asignadas
      },
    ],
    default: [], // Menú vacío por defecto
  },
});

const User = mongoose.model('User', userSchema);

// Esquema de receta
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Título único de la receta
  ingredientes: { type: [String], required: true },
  instrucciones: { type: [String], required: true },
  imagenUrl: { type: String, default: '' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Rutas de la API

// Añadir receta a favoritos
app.post('/api/favorites', async (req, res) => {
  const { email, recipeTitle, imagenUrl } = req.body;

  // Validación de email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({
      error: 'Email inválido o no proporcionado.',
      details: 'El campo email es requerido y debe ser válido.',
    });
  }

  // Validación de recipeTitle
  if (!recipeTitle || typeof recipeTitle !== 'string') {
    return res.status(400).json({
      error: 'Título de receta inválido o no proporcionado.',
      details: 'El campo recipeTitle es requerido y debe ser válido.',
    });
  }

  try {
    // Buscar receta por título
    let recipe = await Recipe.findOne({ title: recipeTitle });

    // Si la receta no existe, crear una nueva receta
    if (!recipe) {
      recipe = new Recipe({
        title: recipeTitle,
        ingredientes: [],  // Definir ingredientes por defecto si no existen
        instrucciones: [], // Definir instrucciones por defecto si no existen
        imagenUrl: imagenUrl || '',  // Asignar imagenUrl si existe o cadena vacía por defecto
      });

      await recipe.save();  // Guardar la receta nueva
    }

    // Ahora que tenemos la receta, vamos a agregarla a los favoritos del usuario
    const user = await User.findOneAndUpdate(
      { email }, 
      { $addToSet: { favoriteRecipes: recipe._id } }, // Usar el _id de la receta
      { upsert: true, new: true }  // Si no existe el usuario, crear uno nuevo
    );

    // Obtener todas las recetas favoritas del usuario utilizando los ObjectIds
    const favoriteRecipes = await Recipe.find({
      '_id': { $in: user.favoriteRecipes }  // Buscamos por los _id de las recetas favoritas
    });

    // Devolver la lista de recetas favoritas del usuario
    res.status(200).json({
      message: 'Receta añadida a favoritos.',
      favoriteRecipes,  // Enviar las recetas favoritas actualizadas
    });
    
  } catch (err) {
    console.error('Error al añadir la receta a favoritos:', err.message);
    res.status(500).json({
      error: 'Error al añadir la receta a favoritos.',
      details: err.message,
    });
  }
});

// Obtener recetas favoritas
app.get('/api/favorites', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'El correo electrónico del usuario es obligatorio.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Crear usuario si no existe
      user = new User({
        email,
        favoriteRecipes: [],
        weeklyMenu: [],  // Menú vacío por defecto
      });

      await user.save(); // Guardar el usuario creado
    }

    // Obtener todas las recetas favoritas utilizando los ObjectIds
    const favoriteRecipes = await Recipe.find({ 
      '_id': { $in: user.favoriteRecipes } 
    });

    res.json(favoriteRecipes);
  } catch (error) {
    console.error('Error al obtener las recetas favoritas:', error);
    res.status(500).json({ error: 'Error al obtener las recetas favoritas.', details: error.message });
  }
});

// Obtener menú semanal
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

app.get('/api/schedule', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'El correo electrónico del usuario es obligatorio.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Crear usuario si no existe
      user = new User({
        email,
        favoriteRecipes: [],
        weeklyMenu: daysOfWeek.map((day) => ({ day, meals: [null, null, null] })), // Inicializa correctamente
      });

      await user.save(); // Guardar el usuario creado
    }

    res.json(user.weeklyMenu);
  } catch (error) {
    console.error('Error al obtener el menú semanal:', error);
    res.status(500).json({ error: 'Error al obtener el menú semanal.', details: error.message });
  }
});

// Configuración del servidor
const port = 3002;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



          


