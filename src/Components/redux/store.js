import {
  configureStore,
} from "@reduxjs/toolkit";

import baseApi from "../API/baseApi.js";

import authReducer from "../../feature/auth/AuthSlice.js";

export const store =
  configureStore({
    reducer: {
      auth:
        authReducer,

      [baseApi.reducerPath]:
        baseApi.reducer,
    },

    middleware: (
      getDefaultMiddleware,
    ) =>
      getDefaultMiddleware().concat(
        baseApi.middleware,
      ),
  });

let previousAccessToken =
  store.getState().auth
    .accessToken;

let previousRefreshToken =
  store.getState().auth
    .refreshToken;

store.subscribe(() => {
  const {
    accessToken,
    refreshToken,
  } =
    store.getState().auth;

  if (
    accessToken !==
    previousAccessToken
  ) {
    previousAccessToken =
      accessToken;

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken,
      );
    } else {
      localStorage.removeItem(
        "accessToken",
      );
    }
  }

  if (
    refreshToken !==
    previousRefreshToken
  ) {
    previousRefreshToken =
      refreshToken;

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken,
      );
    } else {
      localStorage.removeItem(
        "refreshToken",
      );
    }
  }
});