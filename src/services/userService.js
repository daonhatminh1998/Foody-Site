import api from "./api";

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

const userService = {
  login,
  changePassword,
  changeInfor,
};

export default userService;
