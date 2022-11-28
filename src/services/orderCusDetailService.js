import api from "./api";
const list = () => api.get(api.url.orderCusDetail);

const get = (id) => api.get(`${api.url.orderCusDetail}/${id}`);
const add = (data) => api.post(api.url.orderCusDetail, data);
const update = (id, data) => api.put(`${api.url.orderCusDetail}/${id}`, data);
const remove = (id) => api.delete(`${api.url.orderCusDetail}/${id}`);

const OrderCusDetailService = {
  list,
  get,
  add,
  update,
  delete: remove,
};

export default OrderCusDetailService;
