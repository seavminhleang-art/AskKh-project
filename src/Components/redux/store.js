import { configureStore } from "@reduxjs/toolkit";

export function store () {
    return configureStore({
        reducer : {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
        }
    })
}