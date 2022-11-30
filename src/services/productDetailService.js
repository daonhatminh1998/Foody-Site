import api from "./api";
const list = () => api.get(api.url.productDetail);

const getPaging = (p, r, admin, type, s, from, to, q) => {
  let queryString = `p=${p}&r=${r}`;
  if (admin) {
    queryString += `&a=${admin}`;
  }
  if (type) {
    queryString += `&type=${type}`;
  }
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
  return api.get(`${api.url.productDetail}/get_paging?${queryString}`);
};

const get = (ProDe_Id) => api.get(`${api.url.productDetail}/${ProDe_Id}`);

const ProductDetailService = {
  list,
  getPaging,
  get,
};

export default ProductDetailService;
