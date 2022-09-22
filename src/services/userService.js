import api from "./api";
const login = (username, password) => {
  const data = { username, password };
  return api.post(api.url.login, data);
};

const userService = {
  login,
};

export default userService;
