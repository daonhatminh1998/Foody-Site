import api from "./api";
const login = (username, password) => {
  const data = { username, password };
  return api.post(api.url.login, data);
};

const update = (username, password) => {
  const data = { username, password };
  return api.put(api.url.update, data);
};

const userService = {
  login,
  update,
};

export default userService;
