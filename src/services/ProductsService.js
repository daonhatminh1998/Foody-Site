import api from "./api";
const list = () => api.get(api.url.products);
const get = (id) => api.get(`${api.url.products}/${id}`);
const add = (data) => api.post(api.url.products, data);
const update = (id, data) => api.put(`${api.url.products}/${id}`, data);
const remove = (id) => api.delete(`${api.url.products}/${id}`);

const ProductsService = {
  list,
  get,
  add,
  update,
  delete: remove,
};

export default ProductsService;
