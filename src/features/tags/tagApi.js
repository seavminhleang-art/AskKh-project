import { baseApi } from '../../store/api/baseApi';

export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTag: builder.mutation({
      query: (tagName) => ({ url: "/tags", method: "POST", body: { tagName } }),
      invalidatesTags: (_result, error) => error ? [] : ["Tag"],
    }),
    getTags: builder.query({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),
    getPopularTags: builder.query({
      query: () => '/tags/popular',
      providesTags: ['Tag'],
    }),
    getTopTags: builder.query({
      query: (limit = 10) => `/tags/top/${limit}`,
      providesTags: ['Tag'],
    }),
    searchTags: builder.query({
      query: (query) => `/tags/search?query=${encodeURIComponent(query || '')}`,
      providesTags: ['Tag'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateTagMutation,
  useGetTagsQuery,
  useGetPopularTagsQuery,
  useGetTopTagsQuery,
  useSearchTagsQuery,
} = tagApi;

export default tagApi;
