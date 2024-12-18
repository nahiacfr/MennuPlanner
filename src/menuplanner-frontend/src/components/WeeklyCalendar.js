import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from './RecipeCards'; // Componente que muestra las recetas
import '../styles.css'; // Archivo CSS con los estilos necesarios
import { getUserEmail } from '../api'; // Función para obtener el email del usuario
import html2canvas from 'html2canvas'; // Librería para capturar la pantalla

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [schedule, setSchedule] = useState(daysOfWeek.map(() => [null, null, null]));
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener recetas favoritas
  const getFavoriteRecipes = useCallback(async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/api/favorites?email=${userEmail}`);
      if (!response.ok) throw new Error('Error al cargar recetas favoritas.');
      const data = await response.json();
      setFavoriteRecipes(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Obtener el correo del usuario
  useEffect(() => {
    const email = getUserEmail();
    if (email) setUserEmail(email);
    else setError('No se pudo obtener el correo del usuario.');
  }, []);

  // Cargar recetas favoritas cuando se obtiene el correo
  useEffect(() => {
    if (userEmail) getFavoriteRecipes();
  }, [userEmail, getFavoriteRecipes]);

  // Manejo de drag and drop
  const handleDragStart = (e, recipe, origin = null) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
    if (origin) {
      e.dataTransfer.setData('origin', JSON.stringify(origin));
    }
  };

  const handleDrop = (e, dayIndex, slotIndex) => {
    e.preventDefault();

    const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
    const origin = JSON.parse(e.dataTransfer.getData('origin') || null);

    const newSchedule = [...schedule];

    // Si se arrastra desde una posición ya asignada, limpiar esa posición
    if (origin) {
      const { dayIndex: originDay, slotIndex: originSlot } = origin;
      newSchedule[originDay][originSlot] = null;
    }

    // Colocar la receta en la nueva posición si está vacía
    if (!newSchedule[dayIndex][slotIndex]) {
      newSchedule[dayIndex][slotIndex] = recipe;
      setSchedule(newSchedule);
    } else {
      console.warn('El slot ya está ocupado.');
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragEnter = (e) => e.currentTarget.classList.add('drag-over');
  const handleDragLeave = (e) => e.currentTarget.classList.remove('drag-over');

  // Pre-cargar imágenes antes de capturar
  const preloadImages = (selector) => {
    const images = Array.from(document.querySelectorAll(selector));
    return Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );
  };

  // Función para guardar la captura (solo la parte del calendario)
  const saveMenu = async () => {
    try {
      await preloadImages('.calendar-grid img'); // Esperar a que todas las imágenes carguen
      const menuElement = document.querySelector('.calendar-grid'); // Seleccionar solo el contenedor del calendario

      // Capturar el contenedor del calendario incluyendo el fondo
      html2canvas(menuElement, {
        useCORS: true,
        backgroundColor: null, // Aseguramos que no se sobrescriba el fondo
        logging: true, // Habilitar logs para debug (opcional)
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'menu_semanal.png';
        link.click();
      });
    } catch (error) {
      console.error('Error al guardar el menú:', error);
    }
  };

  return (
    <div className="weekly-calendar">
      <div className="header">
        <h2>Planificador Semanal</h2>
        <div className="actions">
          <button onClick={saveMenu} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Menú'}
          </button>
        </div>
      </div>

      <div className="favorites-bar">
        <h3>Recetas Favoritas</h3>
        <div className="favorites-container">
          {loading ? (
            <p>Cargando recetas favoritas...</p>
          ) : error ? (
            <p>{error}</p>
          ) : favoriteRecipes.length === 0 ? (
            <p>No tienes recetas favoritas.</p>
          ) : (
            favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                draggable
                onDragStart={(e) => handleDragStart(e, recipe)}
              />
            ))
          )}
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <h4>{day}</h4>
            {schedule[dayIndex].map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="meal-slot"
                onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                {slot ? (
                  <RecipeCard
                    recipe={slot}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, slot, { dayIndex, slotIndex })
                    }
                  />
                ) : (
                  <div className="empty-slot">+</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;




