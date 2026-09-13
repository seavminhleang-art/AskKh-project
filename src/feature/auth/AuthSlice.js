import {
  createSlice,
} from "@reduxjs/toolkit";

const getStoredValue = (
  key,
) => {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return (
    localStorage.getItem(
      key,
    ) || null
  );
};

const initialState = {
  accessToken:
    getStoredValue(
      "accessToken",
    ),

  refreshToken:
    getStoredValue(
      "refreshToken",
    ),

  user: null,
};

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      setCredentials: (
        state,
        action,
      ) => {
        const {
          accessToken,
          refreshToken,
          user,
        } = action.payload;

        if (
          accessToken !==
          undefined
        ) {
          state.accessToken =
            accessToken;
        }

        if (
          refreshToken !==
          undefined
        ) {
          state.refreshToken =
            refreshToken;
        }

        if (
          user !== undefined
        ) {
          state.user = user;
        }
      },

      setUser: (
        state,
        action,
      ) => {
        state.user =
          action.payload;
      },

      logout: (
        state,
      ) => {
        state.accessToken =
          null;

        state.refreshToken =
          null;

        state.user = null;
      },
    },
  });

export const {
  setCredentials,
  setUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;