import { baseApi } from '../../store/api/baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingle: builder.mutation({
      query: (formData) => ({
        url: '/upload/upload-single',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadMultiple: builder.mutation({
      query: (formData) => ({
        url: '/upload/upload-multiple',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useUploadSingleMutation,
  useUploadMultipleMutation,
} = uploadApi;

export default uploadApi;
