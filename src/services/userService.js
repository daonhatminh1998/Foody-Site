import api from "./api";
const login = (username, password) => {
  const data = { username, password };
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

const getReceiver = (id) => api.get(`${api.url.receiver}/${id}`);
const newReceiver = (data) => api.post(api.url.newReceiver, data);
const updateReceiver = (id, data) =>
  api.put(`${api.url.updateReceiver}/${id}`, data);
const deleteReceiver = (id) => api.delete(`${api.url.deleteReceiver}/${id}`);

const userService = {
  login,
  changePassword,
  changeInfor,
  getReceiver,
  newReceiver,
  updateReceiver,
  deleteReceiver,
};

export default userService;
