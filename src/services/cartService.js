import api from "./api";

const listCart = () => api.get(api.url.carts);
const updateCart = (data) => api.put(api.url.updateCart, data);
const deleteAll = () => api.delete(api.url.deleteAll);

const cartService = {
  listCart,
  updateCart,
  deleteAll,
};

export default cartService;
