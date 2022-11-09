import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    userInfo: {},
  },

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.userInfo = {};
    },

    updateInfo: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
  },
});
export const { login, logout, updateInfo } = authSlice.actions;
export default authSlice.reducer;
