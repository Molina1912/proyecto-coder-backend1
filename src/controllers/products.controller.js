// src/controllers/products.controller.js
import { ProductModel } from '../models/product.model.js';

export const getProducts = async (req, res) => {
  try {
    // 1. Extraer query params
    let { limit = 10, page = 1, sort, query } = req.query;

    // Convertir a números
    limit = parseInt(limit);
    page = parseInt(page);

    // 2. Construir filtro
    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = { $regex: query, $options: 'i' }; // búsqueda insensible a mayúsculas
      }
    }

    // 3. Opciones de ordenamiento
    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    // 4. Opciones de paginación
    const options = {
      limit,
      page,
      sort: sortOption,
      lean: true // mejora rendimiento (devuelve objetos planos)
    };

    // 5. Ejecutar paginación
    const result = await ProductModel.paginate(filter, options);

    // 6. Construir links (prev/next)
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildUrl = (p) => {
      const url = new URL(baseUrl);
      url.searchParams.set('limit', limit);
      url.searchParams.set('page', p);
      if (sort) url.searchParams.set('sort', sort);
      if (query) url.searchParams.set('query', query);
      return url.toString();
    };

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildUrl(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildUrl(result.nextPage) : null
    };

    res.json(response);
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
};