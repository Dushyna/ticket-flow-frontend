import { createApi} from '@reduxjs/toolkit/query/react';
import type { Cinema, MovieHallCreateDto, MovieHallResponseDto } from "../utils/utils.ts";
import {baseQueryWithReauth} from "../../../app/baseQueryWithReauth.ts";

export const cinemaApi = createApi({
    reducerPath: 'cinemaApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Halls', 'Cinemas'],
    endpoints: (builder) => ({
        getCinemas: builder.query<Cinema[], void>({
            query: () => '/cinemas',
            providesTags: ['Cinemas'],
        }),

        createCinema: builder.mutation<Cinema, { name: string; address: string }>({
            query: (newCinema) => ({
                url: '/cinemas',
                method: 'POST',
                body: newCinema,
            }),
            invalidatesTags: ['Cinemas'],
        }),

        createHall: builder.mutation<MovieHallResponseDto, MovieHallCreateDto>({
            query: (newHall) => ({
                url: '/halls',
                method: 'POST',
                body: newHall,
            }),
            invalidatesTags: ['Halls'],
        }),

        getHallsByCinema: builder.query<MovieHallResponseDto[], string>({
            query: (cinemaId) => `/halls/cinema/${cinemaId}`,
            providesTags: ['Halls'],
        }),

        getHallById: builder.query<MovieHallResponseDto, string>({
            query: (id) => `/halls/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Halls', id }],
        }),
        updateHall: builder.mutation<MovieHallResponseDto, { id: string; body: MovieHallCreateDto }>({
            query: ({ id, body }) => ({
                url: `/halls/${id}`,
                method: 'PATCH',
                body,
            }),

            invalidatesTags: (_result, _error, { id }) => [{ type: 'Halls', id }, 'Halls'],
        }),


    }),
});

export const {
    useGetCinemasQuery,
    useCreateHallMutation,
    useCreateCinemaMutation,
    useGetHallByIdQuery,
    useUpdateHallMutation,
    useGetHallsByCinemaQuery
} = cinemaApi;
