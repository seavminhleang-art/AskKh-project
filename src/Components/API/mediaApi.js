import { baseApi } from "../../api/baseApi";

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /upload/upload-single   multipart: { file }
        uploadSingle: builder.mutation({
            query: (formData) => ({
                url: "/upload/upload-single",
                method: "POST",
                body: formData,
            }),
        }),

        // POST /upload/upload-multiple   multipart: { files[] }
        uploadMultiple: builder.mutation({
            query: (formData) => ({
                url: "/upload/upload-multiple",
                method: "POST",
                body: formData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useUploadSingleMutation, useUploadMultipleMutation } = mediaApi;