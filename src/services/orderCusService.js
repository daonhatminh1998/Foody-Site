import api from "./api";

const add = (data) => api.post(api.url.orderCus, data);

const orderCusService = {
  add,
};

export default orderCusService;
