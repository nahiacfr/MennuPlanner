import mysql.connector
from flask import Flask, request, jsonify

app = Flask(__name__)

db_config = {
    'user': 'tu_usuario',
    'password': 'tu_contraseña',
    'host': 'localhost',
    'database': 'menuplanner'
}

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
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)",
            (nombre, correo, contrasena)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(message='Usuario registrado exitosamente'), 201

    except mysql.connector.Error as err:
        return jsonify(error=str(err)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


