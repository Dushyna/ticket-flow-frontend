import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SeatCoordinate {
    row: number;
    col: number;
}

export interface BookingCreateDto {
    hallId: string;
    seats: SeatCoordinate[];
}

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/v1/bookings',
        credentials: 'include',
    }),
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        createBooking: builder.mutation<void, BookingCreateDto>({
            query: (newBooking) => ({
                url: '',
                method: 'POST',
                body: newBooking,
            }),
            invalidatesTags: ['Bookings'],
        }),
        getOccupiedSeats: builder.query<SeatCoordinate[], string>({
            query: (hallId) => `/hall/${hallId}/occupied`,
            providesTags: ['Bookings'],
        }),
    }),
});

export const { useCreateBookingMutation, useGetOccupiedSeatsQuery } = bookingApi;
