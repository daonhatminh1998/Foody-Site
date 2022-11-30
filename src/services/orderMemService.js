import api from "./api";

const list = () => api.get(api.url.orderMem);
const get = (id) => api.get(`${api.url.orderMem}/${id}`);

const order = (data) => api.post(api.url.order, data);

const orderMemService = {
  list,
  get,
  order,
};

export default orderMemService;
