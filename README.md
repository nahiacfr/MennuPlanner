# MenuPlanner App

Este proyecto está compuesto por dos backends: uno en **Python** y otro en **Node.js**, así como un **frontend** en **React**. Aquí encontrarás las instrucciones para ejecutar cada parte del sistema de manera local usando Docker.

## Requisitos

1. **Docker**: Asegúrate de tener Docker y Docker Compose instalados. Puedes seguir las instrucciones de instalación en [Docker Documentation](https://docs.docker.com/get-docker/).

2. **Node.js y npm** (para el backend Node y el frontend):
   - Node.js (versión >= 14.x) y npm están necesarios para ejecutar el backend Node.js y el frontend React.
   - Instálalos desde [Node.js Official Site](https://nodejs.org/).

3. **Python** (solo para el backend en Python, si decides usarlo):
   - Instalar Python desde [Python Official Site](https://www.python.org/).

4. **MySQL** (si no usas Docker para la base de datos):
   - Debes tener MySQL 8.0 instalado si decides usar una base de datos local en lugar de la proporcionada por Docker.

## Estructura del Proyecto

El proyecto contiene tres partes principales:

1. **Backend en Python** (para la autenticación de usuarios y operaciones relacionadas con las recetas).
2. **Backend en Node.js** (recetas favoritas, menús semanales).
3. **Frontend en React** (para la interfaz de usuario).

## Cómo ejecutar el proyecto

### 1. Iniciar el Backend en Python con Docker
cd /backend-python
docker-compose up --build

### 2. Iniciar el Backend en Node
cd /backend-node
npm install
npm install express
npm install mongoose
node index.js

### 3. Iniciar front end en react
cd /mennuplaner-frontend
npm install react react-dom react-scripts
npm start

### 3. OpenApi3.0
cd /mennuplaner-frontend/src
npm install -g swagger-ui-watcher
swagger-ui-watcher ./openapi.yaml

