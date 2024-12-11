# Usar una imagen base oficial de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json . 
COPY package-lock.json .  

# Instalar dependencias
RUN npm install
RUN npm install react react-dom react-scripts

# Copiar el código fuente
COPY . .  

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación React
CMD ["npm", "start"]

