from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import mysql.connector
import os
# import mysql.connector  # Descomenta esto cuando uses MySQL

app = Flask(__name__)
CORS(app)

# Clave secreta para generar tokens (en producción, usa una más segura)
SECRET_KEY = 'mi_clave_secreta'

# Simulación de "base de datos" en memoria
usuarios = []
recetas = []

# Configuración de conexión a MySQL
db_config = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'menuplanner')
}

# Decorador para verificar tokens JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify(error='Token es requerido'), 401
        try:
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify(error='El token ha expirado'), 401
        except jwt.InvalidTokenError:
            return jsonify(error='Token inválido'), 401
        return f(*args, **kwargs)
    return decorated

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
        hashed_password = generate_password_hash(contrasena)
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)",
            (nombre, correo, hashed_password)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        return jsonify(error=f"Error en la base de datos: {err}"), 500

    return jsonify(message='Usuario registrado exitosamente'), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (correo and contrasena):
        return jsonify(error='Correo y contraseña son obligatorios'), 400

    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Buscar el usuario en la base de datos
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        usuario = cursor.fetchone()

        cursor.close()
        conn.close()

        # Si el usuario no existe o la contraseña no coincide
        if not usuario or not check_password_hash(usuario['contrasena'], contrasena):
            return jsonify(error='Correo o contraseña incorrectos'), 401

        # Generar un token JWT
        token = jwt.encode(
            {
                'correo': usuario['correo'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            SECRET_KEY,
            algorithm='HS256'
        )

        return jsonify(token=token), 200

    except mysql.connector.Error as err:
        return jsonify(error=f"Error en la base de datos: {err}"), 500


# Ruta para agregar recetas
@app.route('/api/recipes', methods=['POST'])
@token_required
def add_recipe():
    data = request.get_json()
    nombre = data.get('nombre')
    ingredientes = data.get('ingredientes')
    instrucciones = data.get('instrucciones')
    tiempo_preparacion = data.get('tiempo_preparacion')
    imagen_url = data.get('imagen_url')

    if not (nombre and ingredientes and instrucciones and tiempo_preparacion):
        return jsonify(error='Todos los campos son obligatorios'), 400

    # Insertar la receta en MySQL (comentado por ahora)
    # try:
    #     conn = mysql.connector.connect(**db_config)
    #     cursor = conn.cursor()
    #     cursor.execute(
    #         "INSERT INTO recetas (nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url) VALUES (%s, %s, %s, %s, %s)",
    #         (nombre, ingredientes, instrucciones, tiempo_preparacion, imagen_url)
    #     )
    #     conn.commit()
    #     cursor.close()
    #     conn.close()
    # except mysql.connector.Error as err:
    #     return jsonify(error=str(err)), 500

    # Agregar la receta a la "base de datos" en memoria
    nueva_receta = {
        'id': len(recetas) + 1,
        'nombre': nombre,
        'ingredientes': ingredientes,
        'instrucciones': instrucciones,
        'tiempo_preparacion': tiempo_preparacion,
        'imagen_url': imagen_url
    }
    recetas.append(nueva_receta)

    return jsonify(message='Receta añadida exitosamente', receta=nueva_receta), 201

# Ruta para obtener recetas
@app.route('/api/recipes', methods=['GET'])
@token_required
def get_recipes():
    # Obtener recetas desde MySQL (comentado por ahora)
    # try:
    #     conn = mysql.connector.connect(**db_config)
    #     cursor = conn.cursor(dictionary=True)
    #     cursor.execute("SELECT * FROM recetas")
    #     recetas_db = cursor.fetchall()
    #     cursor.close()
    #     conn.close()
    #     return jsonify(recetas_db), 200
    # except mysql.connector.Error as err:
    #     return jsonify(error=str(err)), 500

    # Devolver recetas de la "base de datos" en memoria
    return jsonify(recetas), 200

@app.route('/api/weekly_menu', methods=['POST'])
@token_required
def save_weekly_menu():
    data = request.get_json()
    menu = data.get('menu')

    if not menu:
        return jsonify(error="El menú es obligatorio"), 400

    # Aquí podrías validar la estructura del menú si es necesario

    # Guardar en memoria (en MySQL deberías insertar o actualizar registros)
    global menu_semanal
    menu_semanal = menu

    return jsonify(message="Menú semanal guardado exitosamente"), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

