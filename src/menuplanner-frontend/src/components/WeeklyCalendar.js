import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from './RecipeCards'; // Asegúrate de tener este componente
import '../styles.css';
import { getUserEmail } from '../api'; // Importamos la función
import html2canvas from 'html2canvas'; // Importamos html2canvas

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
  const handleDragStart = (e, recipe) => e.dataTransfer.setData('recipe', JSON.stringify(recipe));
  const handleDrop = (e, dayIndex, slotIndex) => {
    e.preventDefault();
    const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
    const newSchedule = [...schedule];
    newSchedule[dayIndex][slotIndex] = recipe;
    setSchedule(newSchedule);
  };
  const handleDragOver = (e) => e.preventDefault();

  // Función para guardar la captura
  const saveMenu = () => {
    html2canvas(document.querySelector('.weekly-calendar')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'menu_semanal.png';
      link.click();
    });
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
              >
                {slot ? <RecipeCard recipe={slot} draggable={false} /> : <div className="empty-slot">+</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
