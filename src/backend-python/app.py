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

        return jsonify(userId=usuario['id']), 200

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

# Ruta para agregar recetas importadas
@app.route('/api/recipes/imported/add', methods=['POST'])
def add_imported_recipe():
    data = request.json
    usuario_id = data.get('userId')  # ID del usuario que crea la receta
    nombre = data.get('name')
    ingredientes = ', '.join(data.get('ingredients', []))  # Ingredientes separados por comas
    instrucciones = '. '.join(data.get('instructions', []))  # Instrucciones separadas por punto
    tiempo_preparacion = '00'  # Tiempo de preparación no definido
    imagen_url = data.get('imageUrl')

    if not (usuario_id and nombre and ingredientes and instrucciones):
        return jsonify(error='Todos los campos son obligatorios'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Insertar la receta importada asociada al usuario
        cursor.execute(
            """
            INSERT INTO recetas (usuario_id, nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (usuario_id, nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
        )
        conn.commit()

        # Obtener la receta recién creada
        receta_id = cursor.lastrowid
        cursor.execute("SELECT * FROM recetas WHERE id = %s", (receta_id,))
        nueva_receta = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify(nueva_receta), 201

    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500


# Ruta para agregar recetas
@app.route('/api/recipes/add', methods=['POST'])
def add_recipe():
    data = request.json
    usuario_id = data.get('userId')  # ID del usuario que crea la receta
    nombre = data.get('nombre')
    ingredientes = data.get('ingredientes')
    instrucciones = data.get('instrucciones')
    tiempo_preparacion = data.get('tiempo_preparacion')
    imagen_url = data.get('imagen_url')

    if not (usuario_id and nombre and ingredientes and instrucciones and tiempo_preparacion):
        return jsonify(error='Todos los campos son obligatorios'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Insertar la receta asociada al usuario
        cursor.execute(
            """
            INSERT INTO recetas (usuario_id, nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (usuario_id, nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
        )
        conn.commit()

        # Obtener la receta recién creada
        receta_id = cursor.lastrowid
        cursor.execute("SELECT * FROM recetas WHERE id = %s", (receta_id,))
        nueva_receta = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify(nueva_receta), 201

    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500
        
# Ruta para servir imágenes
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Ruta para subir imágenes
@app.route('/api/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify(error='No se proporcionó ninguna imagen'), 400
    
    imagen = request.files['image']
    if imagen and allowed_file(imagen.filename):
        imagen_filename = secure_filename(imagen.filename)
        imagen_path = os.path.join(app.config['UPLOAD_FOLDER'], imagen_filename)
        imagen.save(imagen_path)
        return jsonify(imageUrl=f"http://localhost:5000/uploads/{imagen_filename}"), 201
    else:
        return jsonify(error='Archivo no permitido'), 400

# Ruta para obtener todas las recetas de un usuario
@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    usuario_id = request.args.get('usuario_id')  # Obtener el usuario_id de los parámetros de la solicitud

    if not usuario_id:
        return jsonify(error='El usuario_id es obligatorio'), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Consulta para obtener las recetas del usuario específico
        cursor.execute("SELECT * FROM recetas WHERE usuario_id = %s", (usuario_id,))
        recetas_db = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(recetas_db), 200
    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500

        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)




