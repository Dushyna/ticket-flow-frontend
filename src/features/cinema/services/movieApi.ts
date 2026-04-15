import { createApi } from '@reduxjs/toolkit/query/react';
import type {Movie, Showtime, ShowtimeRequest, TicketType, TicketTypeRequest} from "../utils/utils.ts";
import { baseQueryWithReauth } from '../../../app/baseQueryWithReauth';

export const movieApi = createApi({
    reducerPath: 'movieApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Movies', 'Showtimes', 'TicketTypes'],
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
        getShowtimesByCinema: builder.query<Showtime[], string>({
            query: (cinemaId) => `/showtimes/cinema/${cinemaId}`,
            providesTags: ['Showtimes'],
        }),
        getShowtimeById: builder.query<Showtime, string>({
            query: (id) => `/showtimes/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Showtimes', id }],
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

        getMyTicketTypes: builder.query<TicketType[], void>({
            query: () => '/ticket-types/my',
            providesTags: ['TicketTypes'],
        }),

        getTicketTypesByOrg: builder.query<TicketType[], string>({
            query: (orgId) => `/ticket-types/organization/${orgId}`,
            providesTags: ['TicketTypes'],
        }),

        createTicketType: builder.mutation<TicketType, TicketTypeRequest>({
            query: (body) => ({
                url: '/ticket-types',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['TicketTypes'],
        }),

        deleteTicketType: builder.mutation<void, string>({
            query: (id) => ({
                url: `/ticket-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TicketTypes'],
        }),

    }),
});

export const {
    useGetMoviesQuery,
    useCreateMovieMutation,
    useDeleteMovieMutation,
    useGetShowtimesByHallQuery,
    useGetShowtimesByCinemaQuery,
    useGetShowtimeByIdQuery,
    useCreateShowtimeMutation,
    useUpsertShowtimeMutation,
    useDeleteShowtimeMutation,
    useGetMyTicketTypesQuery,
    useGetTicketTypesByOrgQuery,
    useCreateTicketTypeMutation,
    useDeleteTicketTypeMutation
} = movieApi;
