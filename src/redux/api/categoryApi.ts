import { apiSlice } from "./baseApi";

export const CategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => ({
        url: "categories/list",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoryQuery } = CategoryApiSlice;
