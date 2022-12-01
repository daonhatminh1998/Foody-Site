import api from "./api";

const listCart = () => api.get(api.url.carts);
const updateCart = (data) => api.put(api.url.updateCart, data);
const addQuantity = (ProDe_Id) => {
  const data = { ProDe_Id };
  api.post(api.url.addQuantity, data);
};

const deleteItem = (ProDe_Id) => {
  const data = { ProDe_Id };
  return api.post(api.url.deleteItem, data);
};

const deleteAll = () => api.delete(api.url.deleteAll);

const cartService = {
  listCart,
  updateCart,
  addQuantity,
  deleteItem,
  deleteAll,
};

export default cartService;
