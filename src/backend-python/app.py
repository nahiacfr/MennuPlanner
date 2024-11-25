from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuración de conexión a MySQL
db_config = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'menuplanner')
}

# Configuración para subir archivos
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegurarse de que el directorio de carga existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# Ruta para iniciar sesión
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (correo and contrasena):
        return jsonify(error='Correo y contraseña son obligatorios'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Buscar el usuario en la base de datos
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        usuario = cursor.fetchone()

        cursor.close()
        conn.close()

        # Si el usuario no existe o la contraseña no coincide
        if not usuario or usuario['contrasena'] != contrasena:
            return jsonify(error='Correo o contraseña incorrectos'), 401

        return jsonify(message='Login exitoso'), 200

    except mysql.connector.Error as err:
        return jsonify(error=f"Error en la base de datos: {err}"), 500
# Ruta para registrar usuarios
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (nombre and correo and contrasena):
        return jsonify(error='Todos los campos son obligatorios'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si el correo ya está registrado
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        if cursor.fetchone():
            return jsonify(error='El correo ya está registrado'), 400

        # Insertar el usuario
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)",
            (nombre, correo, contrasena)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        return jsonify(error=f"Error en la base de datos: {err}"), 500

    return jsonify(message='Usuario registrado exitosamente'), 201

# Ruta para agregar recetas
@app.route('/api/recipes', methods=['POST'])
def add_recipe():
    data = request.form
    nombre = data.get('nombre')
    ingredientes = data.get('ingredientes')
    instrucciones = data.get('instrucciones')
    tiempo_preparacion = data.get('tiempo_preparacion')

    # Verificar si se cargó una imagen
    imagen = request.files.get('imagen')
    if imagen and allowed_file(imagen.filename):
        imagen_filename = secure_filename(imagen.filename)
        imagen_path = os.path.join(app.config['UPLOAD_FOLDER'], imagen_filename)
        imagen.save(imagen_path)
        imagen_url = f"http://localhost:5000/uploads/{imagen_filename}"  # URL accesible de la imagen
    else:
        imagen_url = None

    if not (nombre and ingredientes and instrucciones and tiempo_preparacion):
        return jsonify(error='Todos los campos son obligatorios'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insertar la receta en MySQL
        cursor.execute(
            "INSERT INTO recetas (nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url) VALUES (%s, %s, %s, %s, %s)",
            (nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500

    return jsonify(message='Receta añadida exitosamente'), 201

# Ruta para obtener recetas
@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM recetas")
        recetas_db = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(recetas_db), 200
    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500

# Ruta para servir imágenes
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



