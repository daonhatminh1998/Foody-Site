import api from "./api";

const list = () => api.get(api.url.orders);
const get = (id) => api.get(`${api.url.orders}/${id}`);
const add = (data) => api.post(api.url.orders, data);
const update = (id, data) => api.put(`${api.url.orders}/${id}`, data);
const remove = (id) => api.delete(`${api.url.orders}/${id}`);

const ordersServices = {
  list: list,
  get: get,
  add: add,
  update: update,
  delete: remove,
};

export default ordersServices;
