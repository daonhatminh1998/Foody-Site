import api from "./api";

const list = () => api.get(api.url.orderMem);
const get = (id) => api.get(`${api.url.orderMem}/${id}`);

const getPaging = (p, r, s, from, to, q) => {
  let queryString = `p=${p}&r=${r}`;

  if (s) {
    queryString += `&s=${s}`;
  }
  if (to) {
    queryString += `&to=${to}`;
  }
  if (from) {
    queryString += `&from=${from}`;
  }
  if (q) {
    queryString += `&q=${q}`;
  }
  return api.get(`${api.url.orderMem}/get_paging?${queryString}`);
};

const order = (data) => api.post(api.url.orderMem, data);

const orderMemService = {
  getPaging,
  list,
  get,
  order,
};

export default orderMemService;
