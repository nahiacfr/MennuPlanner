import mysql.connector
from flask import Flask, jsonify
from mysql.connector import Error

app = Flask(__name__)

# Configuración de conexión a MySQL
db_config = {
    'user': 'nahia',         # Reemplaza con tu usuario de MySQL
    'password': 'sonina',    # Reemplaza con tu contraseña de MySQL
    'host': 'localhost',     # Host de MySQL
    'database': 'menuplanner'  # Nombre de la base de datos
}

# Probar la conexión a la base de datos
@app.route('/api/test_db_connection', methods=['GET'])
def test_db_connection():
    try:
        # Usar 'with' para gestionar la conexión de forma más segura
        with mysql.connector.connect(**db_config) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM usuarios")  # Asegúrate de que la tabla 'usuarios' exista
                users = cursor.fetchall()

                # Si no hay usuarios en la base de datos, podemos devolver un mensaje apropiado
                if not users:
                    return jsonify(message="No se encontraron usuarios en la base de datos."), 404

                return jsonify(message="Conexión exitosa a la base de datos!", users=users), 200

    except Error as err:
        # Manejo de errores de conexión
        return jsonify(error=f"Error al conectar a la base de datos: {str(err)}"), 500

if __name__ == '__main__':
    # Cambiar el host a '0.0.0.0' solo si es necesario para tu entorno de red
    app.run(host='127.0.0.1', port=5000, debug=True)  # debug=True solo en desarrollo
