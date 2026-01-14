import { ProductModel } from '../models/product.model.js';

export const getProducts = async (req, res) => {
  try {
   
    let { limit = 10, page = 1, sort, query } = req.query;

    
    limit = parseInt(limit);
    page = parseInt(page);

   
    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = { $regex: query, $options: 'i' }; 
      }
    }

    
    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    
    const options = {
      limit,
      page,
      sort: sortOption,
      lean: true 
    };

    
    const result = await ProductModel.paginate(filter, options);

   
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