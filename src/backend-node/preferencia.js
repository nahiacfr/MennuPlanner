const mongoose = require('mongoose');

// Definir el esquema para las preferencias de usuario
const preferenciaSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
  idioma: { type: String, default: 'es' },
  tema: { type: String, default: 'oscuro' },
  notificaciones: { type: Boolean, default: true }
});

// Crear el modelo a partir del esquema
const Preferencia = mongoose.model('Preferencia', preferenciaSchema);

// Exportar el modelo para poder utilizarlo en otros archivos
module.exports = Preferencia;
