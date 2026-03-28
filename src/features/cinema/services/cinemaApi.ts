import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Cinema, MovieHallCreateDto, MovieHallResponseDto } from "../utils/utils.ts";

export const cinemaApi = createApi({
    reducerPath: 'cinemaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/v1',
        credentials: 'include',
    }),
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
    }),
});

export const {
    useGetCinemasQuery,
    useCreateHallMutation,
    useCreateCinemaMutation,
    useGetHallsByCinemaQuery
} = cinemaApi;
