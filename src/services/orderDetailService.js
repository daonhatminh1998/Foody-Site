import api from "./api";
const list = () => api.get(api.url.orderDetail);

const get = (id) => api.get(`${api.url.orderDetail}/${id}`);
const add = (data) => api.post(api.url.orderDetail, data);
const update = (id, data) => api.put(`${api.url.orderDetail}/${id}`, data);
const remove = (id) => api.delete(`${api.url.orderDetail}/${id}`);

const OrderDetailService = {
  list,
  get,
  add,
  update,
  delete: remove,
};

export default OrderDetailService;
