import api from "./api";
const list = () => api.get(api.url.products);
const get = (id) => api.get(`${api.url.products}/${id}`);

const ProductsService = {
  list,
  get,
};

export default ProductsService;
