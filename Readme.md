# Tienda de Suculentas – Backend
Tienda online dedicada a las suculentas: plantas decorativas, fáciles de cuidar y perfectas para cualquier espacio. 

Backend desarrollado en **Node.js + Express** con **MongoDB Atlas** y **Handlebars**, como entrega final del curso de Backend I en CoderHouse.

## Funcionalidades

- Catálogo de **20 productos** organizados en categorías: plantas, maceteros, semillas y accesorios
- **Filtros por categoría**, **ordenamiento por precio** y **paginación**
- **Carrito de compras** con operaciones CRUD:
  - Agregar productos (con incremento de cantidad)
  - Eliminar productos individualmente
  - Ver total de la compra
- Vistas renderizadas con **Handlebars**
- Diseño responsive y navegación intuitiva

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose + mongoose-paginate-v2
- express-handlebars

## ▶Instrucciones para ejecutar

### 1. Clonar el repositorio

git clone https://github.com/Molina1912/proyecto-coder-backend1.git
cd proyecto-coder-backend1

### Instalar Dependencias
npm install

### Poblar Datos (opcional)
node src/utils/seed.js

### Iniciar Servidor
npm start o npm server.js

### Acceder a la Aplicación 
http://localhost:8080