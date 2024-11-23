from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
# import mysql.connector  # Descomenta esto cuando uses MySQL

app = Flask(__name__)
CORS(app)

# Clave secreta para generar tokens (en producción, usa una más segura)
SECRET_KEY = 'mi_clave_secreta'

# Simulación de "base de datos" en memoria
usuarios = []
recetas = []

# Configuración de conexión a MySQL (comentada por ahora)
# db_config = {
#     'user': 'tu_usuario',
#     'password': 'tu_contraseña',
#     'host': 'localhost',
#     'database': 'menuplanner'
# }

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

    # Verificar si el correo ya está registrado (simulación)
    for usuario in usuarios:
        if usuario['correo'] == correo:
            return jsonify(error='El correo ya está registrado'), 400

    # Hash de la contraseña
    hashed_password = generate_password_hash(contrasena)

    # Insertar en MySQL (comentado por ahora)
    # try:
    #     conn = mysql.connector.connect(**db_config)
    #     cursor = conn.cursor()
    #     cursor.execute(
    #         "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)",
    #         (nombre, correo, hashed_password)
    #     )
    #     conn.commit()
    #     cursor.close()
    #     conn.close()
    # except mysql.connector.Error as err:
    #     return jsonify(error=str(err)), 500

    # Agregar el usuario a la "base de datos" en memoria
    nuevo_usuario = {
        'nombre': nombre,
        'correo': correo,
        'contrasena': hashed_password  # Guardar el hash
    }
    usuarios.append(nuevo_usuario)

    return jsonify(message='Usuario registrado exitosamente'), 201

# Ruta para iniciar sesión
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (correo and contrasena):
        return jsonify(error='Correo y contraseña son obligatorios'), 400

    # Verificar credenciales (simulación)
    for usuario in usuarios:
        if usuario['correo'] == correo and check_password_hash(usuario['contrasena'], contrasena):
            # Generar un token de autenticación
            token = jwt.encode(
                {
                    'correo': correo,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm='HS256'
            )
            return jsonify(token=token), 200

    # Verificar credenciales con MySQL (comentado por ahora)
    # try:
    #     conn = mysql.connector.connect(**db_config)
    #     cursor = conn.cursor(dictionary=True)
    #     cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
    #     user = cursor.fetchone()
    #     cursor.close()
    #     conn.close()
    #     if user and check_password_hash(user['contrasena'], contrasena):
    #         token = jwt.encode(
    #             {
    #                 'correo': correo,
    #                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    #             },
    #             SECRET_KEY,
    #             algorithm='HS256'
    #         )
    #         return jsonify(token=token), 200
    # except mysql.connector.Error as err:
    #     return jsonify(error=str(err)), 500

    return jsonify(error='Correo o contraseña incorrectos'), 401

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

