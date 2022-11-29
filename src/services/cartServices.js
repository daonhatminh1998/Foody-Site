import api from "./api";

const listCart = () => api.get(api.url.carts);
const updateCart = (data) => api.post(api.url.carts, data);

const cartServices = {
  listCart,
  updateCart,
};

export default cartServices;
