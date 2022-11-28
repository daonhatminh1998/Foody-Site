import api from "./api";

//--------------------------------Member Information------------------------------------------------
const login = (username, password, cartItem) => {
  const data = { username, password, cartItem };
  return api.post(api.url.login, data);
};

const changePassword = (password, newPassword, confirmPassword) => {
  const data = { password, newPassword, confirmPassword };
  return api.post(api.url.changePassword, data);
};

const changeInfor = (name, email, avatar, bgImg) => {
  const data = { name, email, avatar, bgImg };
  return api.post(api.url.changeInfor, data);
};

//--------------------------------Member Receiver------------------------------------------------
const getReceiver = (id) => api.get(`${api.url.receiver}/${id}`);
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

//--------------------------------Member Order------------------------------------------------
const order = (id) => {
  const data = { id };
  return api.post(api.url.order, data);
};

const userService = {
  login,
  changePassword,
  changeInfor,

  getReceiver,
  defaultReceiver,
  chosenReceiver,
  reset,
  newReceiver,
  updateReceiver,
  deleteReceiver,

  order,
};

export default userService;
