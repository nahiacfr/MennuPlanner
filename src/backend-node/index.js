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

// Esquema de usuario con solo el correo electrónico (userId) y recetas favoritas
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },  // Usamos el correo electrónico como userId
  favoriteRecipes: { type: [String], ref: 'Recipe', default: [] }, // Cambiar ObjectId por String para title
});

const User = mongoose.model('User', userSchema);

// Esquema de receta con solo title
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },  // Usamos title como identificador único
  ingredientes: { type: [String], required: true },
  instrucciones: { type: [String], required: true },
  imagenUrl: { type: String, default: '' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Ruta para añadir receta a favoritos
app.post('/api/favorites', async (req, res) => {
    try {
      const { userId, recipeTitle, recipeImageUrl } = req.body;  // Cambiar recipeId a recipeTitle y recibir imageUrl
  
      // Buscar si el usuario con el correo electrónico existe
      let user = await User.findOne({ userId: userId });
  
      // Si el usuario no existe, se crea uno nuevo con el correo electrónico como userId
      if (!user) {
        user = new User({
          userId: userId,  // Usamos el correo electrónico como userId
          favoriteRecipes: [],
        });
        await user.save();
      }
  
      // Verificar si la receta existe (usando el title)
      let recipe = await Recipe.findOne({ title: recipeTitle });  // Buscar por title
  
      // Si la receta no existe, se crea una nueva receta
      if (!recipe) {
        recipe = new Recipe({
          title: recipeTitle,  // Usar title
          ingredientes: [],
          instrucciones: [],
          imagenUrl: recipeImageUrl || '',  // Asignar la URL de la imagen si se proporciona
        });
        await recipe.save();
      } else {
        // Si la receta ya existe, actualizamos la imagen si es nueva
        if (recipeImageUrl && recipe.imagenUrl !== recipeImageUrl) {
          recipe.imagenUrl = recipeImageUrl;
          await recipe.save();
        }
      }
  
      // Añadir la receta a los favoritos si no está ya en la lista
      if (!user.favoriteRecipes.includes(recipeTitle)) {
        user.favoriteRecipes.push(recipeTitle);
        await user.save();
      }
  
      res.json({ message: 'Receta añadida a favoritos', favoriteRecipes: user.favoriteRecipes });
    } catch (error) {
      console.error('Error al añadir la receta a favoritos:', error);
      res.status(500).json({ error: 'Error al añadir la receta a favoritos', details: error.message });
    }
  });
  
// Ruta para obtener las recetas favoritas de un usuario
app.get('/api/favorites', async (req, res) => {
    try {
      const { userId } = req.query; // Obtener el correo electrónico del usuario desde los parámetros de consulta
  
      if (!userId) {
        return res.status(400).json({ error: 'El correo electrónico del usuario es obligatorio.' });
      }
  
      // Buscar el usuario por correo electrónico
      const user = await User.findOne({ userId });
  
      if (!user) {
        return res.json({ favoriteRecipes: [] }); // Si el usuario no existe, devolver lista vacía
      }
  
      // Buscar las recetas favoritas por título
      const favoriteRecipes = await Recipe.find({ title: { $in: user.favoriteRecipes } });
  
      res.json(favoriteRecipes); // Devolver las recetas favoritas
    } catch (error) {
      console.error('Error al obtener las recetas favoritas:', error);
      res.status(500).json({ error: 'Error al obtener las recetas favoritas', details: error.message });
    }
  });
  
// Asegúrate de que el servidor escuche en un puerto
const port = 3002;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

          


