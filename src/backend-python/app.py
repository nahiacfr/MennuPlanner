import pymysql
from flask import Flask, jsonify

app = Flask(__name__)

db_config = {
    'user': 'root',
    'password': 'nueva_contraseña',
    'host': '127.0.0.1',
    'database': 'menuplanner'
}

@app.route('/api/test_db_connection', methods=['GET'])
def test_db_connection():
    conn = None  # Inicializar la variable conn como None
    try:
        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM usuarios")
            users = cursor.fetchall()
            if not users:
                return jsonify(message="No se encontraron usuarios en la base de datos."), 404

            return jsonify(message="Conexión exitosa a la base de datos!", users=users), 200
    except pymysql.MySQLError as err:
        return jsonify(error=f"Error al conectar a la base de datos: {str(err)}"), 500
    finally:
        if conn:  # Verifica si conn tiene un valor antes de cerrarla
            conn.close()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

