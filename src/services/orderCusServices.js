import api from "./api";

const list = () => api.get(api.url.orderCus);
const get = (id) => api.get(`${api.url.orderCus}/${id}`);
const add = (data) => api.post(api.url.orderCus, data);
const update = (id, data) => api.put(`${api.url.orderCus}/${id}`, data);
const remove = (id) => api.delete(`${api.url.orderCus}/${id}`);

const OrderCusServices = {
  list: list,
  get: get,
  add: add,
  update: update,
  delete: remove,
};

export default OrderCusServices;
