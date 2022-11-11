import axios from "axios";
import store from "../store";
import { hideLoading, showLoading } from "react-redux-loading-bar";

const url = {
  baseUrl: "http://localhost/foody/member/",
  // baseUrl: "https://myfoody290798.herokuapp.com/api/",
  login: "login",
  changePassword: "changePassword",
  changeInfor: "changeInfor",

  addQuantity: "addQuantity",
  removeQuantity: "removeQuantity",
  deleteItem: "deleteItem",
  deleteAll: "deleteAll",

  receiver: "receiver",
  newReceiver: "newReceiver",
  updateReceiver: "updateReceiver",
  deleteReceiver: "deleteReceiver",

  products: "products",
  productDetail: "productDetail",
  orders: "orders",
  orderDetail: "orderDetail",
};

const instance = axios.create({
  baseURL: url.baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((request) => {
  const state = store.getState();
  if (state.auth.token) {
    request.headers.Authorization = `Bearer ${state.auth.token}`;
  }
  store.dispatch(showLoading());
  return request;
});

instance.interceptors.response.use(
  (response) => {
    setTimeout(() => store.dispatch(hideLoading()), 100);
    return response.data;
  },

  (error) => {
    setTimeout(() => store.dispatch(hideLoading()), 100);

    if (!error.resonse || error.resonse.status === 0) {
      // window.location.href = "/network-error";
    } else {
      switch (error.resonse.status) {
        case 401:
          window.location.href = "/Login";
          break;
        case 403:
          window.location.href = "/no-permission";
          break;
        default:
          break;
      }
      return Promise.reject(error);
    }
  }
);

const api = {
  url,
  instance,
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  patch: instance.patch,
  promise: axios.all,
  spread: axios.spread,
};

export default api;
