export interface SeatCoordinate {
    row: number;
    col: number;
    ticketTypeId?: string;
}

export interface BookingCreateDto {
    showtimeId: string;
    seats: SeatCoordinate[];
}

export interface PaymentResponseDto {
    paymentUrl: string;
}

export interface BookingResponseDto {
    id: string;
    orderId: string;
    movieTitle: string;
    hallName: string;
    startTime: string;
    seat: {
        row: number;
        col: number;
    };
    ticketLabel: string;
    price: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface TicketVerificationResponse {
    valid: boolean;
    message: string;
    movieTitle: string | null;
    seatInfo: string | null;
    startTime: string | null;
}

export interface BoxOfficeOrderResponse {
    orderId: string;
    bookingIds: string[];
}

export interface CashierHistoryItem {
    orderId: string;
    movieTitle: string;
    hallName: string;
    ticketsCount: number;
    totalPrice: number;
    createdAt: string;
}
