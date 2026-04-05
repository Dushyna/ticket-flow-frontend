import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {Movie, Showtime, ShowtimeRequest} from "../utils/utils.ts";


export const movieApi = createApi({
    reducerPath: 'movieApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/v1',
        credentials: 'include',
    }),
    tagTypes: ['Movies', 'Showtimes'],
    endpoints: (builder) => ({
        getMovies: builder.query<Movie[], void>({
            query: () => '/movies',
            providesTags: ['Movies'],
        }),
        createMovie: builder.mutation<Movie, Partial<Movie>>({
            query: (movie) => ({ url: '/movies', method: 'POST', body: movie }),
            invalidatesTags: ['Movies'],
        }),
        deleteMovie: builder.mutation<void, string>({
            query: (id) => ({
                url: `/movies/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Movies'],
        }),

        getShowtimesByHall: builder.query<Showtime[], string>({
            query: (hallId) => `/showtimes/hall/${hallId}`,
            providesTags: ['Showtimes'],
        }),
        createShowtime: builder.mutation<Showtime, Partial<Showtime>>({
            query: (showtime) => ({ url: '/showtimes', method: 'POST', body: showtime }),
            invalidatesTags: ['Showtimes'],
        }),
        upsertShowtime: builder.mutation<Showtime, ShowtimeRequest>({
            query: (showtime) => ({
                url: showtime.id ? `/showtimes/${showtime.id}` : '/showtimes',
                method: showtime.id ? 'PATCH' : 'POST',
                body: showtime,
            }),
            invalidatesTags: ['Showtimes'],
        }),

        deleteShowtime: builder.mutation<void, string>({
            query: (id) => ({ url: `/showtimes/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Showtimes'],
        }),



    }),
});

export const {
    useGetMoviesQuery,
    useCreateMovieMutation,
    useDeleteMovieMutation,
    useGetShowtimesByHallQuery,
    useCreateShowtimeMutation,
    useUpsertShowtimeMutation,
    useDeleteShowtimeMutation
} = movieApi;
