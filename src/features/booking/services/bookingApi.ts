import { createApi } from '@reduxjs/toolkit/query/react';
import type {BookingCreateDto, SeatCoordinate} from "../utils/utils.ts";
import { baseQueryWithReauth } from '../../../app/baseQueryWithReauth';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        createBooking: builder.mutation<void, BookingCreateDto>({
            query: (newBooking) => ({
                url: '/bookings',
                method: 'POST',
                body: newBooking,
            }),
            invalidatesTags: ['Bookings'],
        }),
        getOccupiedSeats: builder.query<SeatCoordinate[], string>({
            query: (showtimeId) => `/bookings/occupied/${showtimeId}`,
            providesTags: ['Bookings'],
        }),
    }),
});

export const { useCreateBookingMutation, useGetOccupiedSeatsQuery } = bookingApi;
