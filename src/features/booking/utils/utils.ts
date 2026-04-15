export interface SeatCoordinate {
    row: number;
    col: number;
    ticketTypeId?: string;
}

export interface BookingCreateDto {
    showtimeId: string;
    seats: SeatCoordinate[];
}
