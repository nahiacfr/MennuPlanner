# Usar una imagen base oficial de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json .  
COPY package-lock.json .  

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .  

# Exponer el puerto
EXPOSE 3002

# Ejecutar la aplicación
CMD ["node", "index.js"]

