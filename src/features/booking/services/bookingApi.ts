import { createApi } from '@reduxjs/toolkit/query/react';
import type {
    BookingCreateDto,
    BookingResponseDto, BoxOfficeOrderResponse, CashierHistoryItem,
    PaymentResponseDto,
    SeatCoordinate,
    TicketVerificationResponse
} from "../utils/utils.ts";
import { baseQueryWithReauth } from '../../../app/baseQueryWithReauth';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        createBooking: builder.mutation<PaymentResponseDto, BookingCreateDto>({
            query: (newBooking) => ({
                url: '/bookings',
                method: 'POST',
                body: newBooking,
            }),
            invalidatesTags: ['Bookings'],
        }),

        getMyBookings: builder.query<BookingResponseDto[], void>({
            query: () => '/bookings/my',
            providesTags: ['Bookings'],
        }),

        getPaymentUrl: builder.query<PaymentResponseDto, string>({
            query: (orderId) => `/bookings/payment-url/${orderId}`,
        }),

        getOccupiedSeats: builder.query<SeatCoordinate[], string>({
            query: (showtimeId) => `/bookings/occupied/${showtimeId}`,
            providesTags: ['Bookings'],
        }),

        getOrderStatus: builder.query<{status: string}, string>({
            query: (sessionId) => `/bookings/status/${sessionId}`,
            providesTags: ['Bookings'],
        }),

        sellAtBoxOffice: builder.mutation<BoxOfficeOrderResponse, BookingCreateDto>({
            query: (boxOfficeBooking) => ({
                url: '/bookings/box-office',
                method: 'POST',
                body: boxOfficeBooking,
            }),
            invalidatesTags: ['Bookings'],
        }),

        verifyTicketEntrance: builder.mutation<TicketVerificationResponse, string>({
            query: (bookingId) => ({
                url: `/bookings/verify-entrance/${bookingId}`,
                method: 'GET', // Adjusted to GET to match query standards
            }),
            invalidatesTags: ['Bookings'],
        }),

        downloadOrderTicketsPdf: builder.query<Blob, string>({
            query: (orderId) => ({
                url: `/tickets/download/order/${orderId}`, // Points directly to your new TicketDownloadController API
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),

        getCashierHistory: builder.query<CashierHistoryItem[], void>({
            query: () => '/bookings/cashier/history',
            providesTags: ['Bookings'],
        }),

    }),
});

export const {
    useCreateBookingMutation,
    useGetOccupiedSeatsQuery,
    useGetMyBookingsQuery,
    useLazyGetPaymentUrlQuery,
    useGetOrderStatusQuery,
    useSellAtBoxOfficeMutation,
    useGetCashierHistoryQuery,
    useVerifyTicketEntranceMutation,
    useLazyDownloadOrderTicketsPdfQuery
} = bookingApi;
