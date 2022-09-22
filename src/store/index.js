import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import storage from "redux-persist/lib/storage";
import { loadingBarReducer } from "react-redux-loading-bar";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";

const authPersistConfig = { key: "auth", storage };
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  loadingBar: loadingBarReducer,
});

const syscConfig = {
  blacklist: ["persist/PERSIST"],
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, createStateSyncMiddleware(syscConfig)],
});

initMessageListener(store);

export default store;
export const persistor = persistStore(store);
