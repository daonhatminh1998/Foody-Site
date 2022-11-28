import api from "./api";

const listCart = () => api.get(api.url.carts);
const updateCart = (data) => api.post(api.url.carts, data);

const get = (id) => api.get(`${api.url.orders}/${id}`);

const remove = (id) => api.delete(`${api.url.orders}/${id}`);

const ordersServices = {
  listCart,
  get,
  updateCart,
  remove,
};

export default ordersServices;
