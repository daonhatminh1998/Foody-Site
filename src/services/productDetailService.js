import api from "./api";
const list = () => api.get(api.url.productDetail);

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
  return api.get(`${api.url.productDetail}/get_paging?${queryString}`);
};

const get = (id) => api.get(`${api.url.productDetail}/${id}`);
// const add = (data) => api.post(api.url.productDetail, data);
const add = (data) => {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  return api.post(api.url.productDetail, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// const update = (id, data) => api.put(`${api.url.productDetail}/${id}`, data);
const update = (id, data) => {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  return api.post(`${api.url.productDetail}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// get img with full path
const getAvatarUrl = (id) =>
  api.get(`${api.url.productDetail}/get_image_url/${id}`);
// get img with base64 encode
const getAvatarBase64 = (id) =>
  api.get(`${api.url.productDetail}/get_image_base64/${id}`);
//get img stream
const getAvatar = (id) =>
  api.get(`${api.url.productDetail}/get_image/${id}`, {
    responseType: "blob",
  });

const remove = (id) => api.delete(`${api.url.productDetail}/${id}`);

const ProductDetailService = {
  list,
  getPaging,
  get,
  getAvatar,
  getAvatarUrl,
  getAvatarBase64,
  add,
  update,
  delete: remove,
};

export default ProductDetailService;
