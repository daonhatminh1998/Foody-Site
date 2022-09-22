import api from "./api";

const list = () => api.get(api.url.customers);
const get = (id) => api.get(`${api.url.customers}/${id}`);
const add = (data) => api.post(api.url.customers, data);
const update = (id, data) => api.put(`${api.url.customers}/${id}`, data);
const remove = (id) => api.delete(`${api.url.customers}/${id}`);

const customersService = {
  list: list,
  get: get,
  add: add,
  update: update,
  delete: remove,
};

export default customersService;
