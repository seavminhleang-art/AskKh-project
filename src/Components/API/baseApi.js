import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useState } from "react";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_FORUM_LOST_URL,
    prepareHeaders: (headers, {getState}) =>{
        const token = getState().auth.accessToken;
        if(token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers;
    }
});