import api from "./api";

const list = () => api.get(api.url.receiver);
const get = (id) => api.get(`${api.url.receiver}/${id}`);

const defaultReceiver = (Re_Id) => {
  const data = { Re_Id };
  return api.post(api.url.default, data);
};
const chosenReceiver = (Re_Id) => {
  const data = { Re_Id };
  return api.post(api.url.chosen, data);
};
const reset = () => api.post(api.url.reset);

const newReceiver = (data) => api.post(api.url.newReceiver, data);
const updateReceiver = (id, data) =>
  api.put(`${api.url.updateReceiver}/${id}`, data);
const deleteReceiver = (id) => api.delete(`${api.url.deleteReceiver}/${id}`);

const receiverService = {
  list,
  get,
  defaultReceiver,
  chosenReceiver,
  reset,
  newReceiver,
  updateReceiver,
  deleteReceiver,
};

export default receiverService;
