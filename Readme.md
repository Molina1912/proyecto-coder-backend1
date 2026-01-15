# Backend - Tienda de Suculentas

Backend desarrollado en **Node.js + Express** con **MongoDB Atlas** y **Handlebars**

Este sistema gestiona productos y carritos con funcionalidades de : paginación, filtros, ordenamiento y relaciones entre documentos mediante `populate`.

---

## Funcionalidades

### Productos
- Listado con **paginación** (10 productos por página por defecto)
- Filtros por:
  - **Categoría** (`plantas`, `maceteros`, `semillas`, `accesorios`)
  - **Disponibilidad** (`true`/`false`)
- Ordenamiento por **precio** (ascendente o descendente)
- Vista de detalle individual

### Carritos
- Almacenan solo el **ID del producto** (optimización)
- Al leerse, se **pueblan** con datos completos del producto (`populate`)
- Operaciones CRUD :
  - Agregar/eliminar productos
  - Actualizar cantidades
  - Vaciar carrito
  - Reemplazar contenido completo

### Vistas
- Interfaz renderizada con **Handlebars**
- Diseño responsive básico
- Navegación intuitiva entre productos, detalles y carrito

---

## Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB Atlas** (base de datos en la nube)
- **Mongoose** (ODM)
- **mongoose-paginate-v2**
- **express-handlebars**

---

## Instalación y uso

1. Clonar el repositorio:
   bash
   git clone https://github.com/Molina1912/proyecto-coder-backend1.git
   cd entrega-backend-suculentas
