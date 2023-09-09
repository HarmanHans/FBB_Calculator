import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    basequery: fetchBaseQuery({ baseUrl: 'http://localhost:3000'}),
    tagTypes: ['Schemas'],
    endpoints: builder => ({})
})