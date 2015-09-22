
module.exports = {
  limit: async (req) => {
    return req.session.ProductService_productQuery_limit =
    parseInt(req.param('limit',
      req.session.ProductService_productQuery_limit || 10
    ));
  },
  offset: async (req) => {
    return page(req) * limit(req);
  },
  page: async (req) => {
    return req.session.ProductService_productQuery_page =
    parseInt(req.param('page',
      req.session.ProductService_productQuery_page || 0
    ));
  }
};
