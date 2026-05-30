import { type ZoneConfig } from '../../../pages/hall/types';

export interface MovieHallCreateDto {
    name: string;
    cinemaId: string;
    rows: number;
    cols: number;
    layoutConfig: {
        grid: string[][];
        zoneConfigs: ZoneConfig[];
    };
}

export interface MovieHallResponseDto {
    id: string;
    name: string;
    cinemaId: string;
    organizationId: string;
    rowsCount: number;
    colsCount: number;
    layoutConfig: {
        grid: string[][];
        zoneConfigs: ZoneConfig[];
    };
}
export interface Cinema {
    id: string;
    name: string;
    address: string;
    organizationId: string;
}
export interface Movie {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    posterUrl: string;
    releaseDate: string;
}

export interface ShowtimeRequest {
    id?: string;
    hallId: string;
    startTime: string;
    endTime?: string;
    movieId: string;
    basePrice: number;
}

export interface Showtime {
    id: string;
    movieId: string;
    movieTitle: string;
    cinemaId: string;
    hallId: string;
    hallName: string;
    startTime: string;
    endTime: string;
    basePrice: number;
}

export interface TicketType {
    id: string;
    label: string;
    discount: number;
    isDefault: boolean;
}

export interface TicketTypeRequest {
    label: string;
    discount: number;
    isDefault: boolean;
}

export interface SeatSelectionNode {
    r: number;
    c: number;
    typeId?: string;
}

export const calculateSeatPrice = (
    seat: SeatSelectionNode,
    basePrice: number,
    grid: string[][],
    zoneConfigs: Array<{ id: string; multiplier?: number }>,
    ticketTypes: Array<{ id: string; discount: number }>,
    defaultTicketType?: { id: string; discount: number }
): number => {
    const zoneId = grid[seat.r]?.[seat.c];
    const zone = zoneConfigs.find(z => z.id === zoneId);
    const zoneMultiplier = zone?.multiplier || 1.0;

    const ticketType = ticketTypes.find(t => t.id === seat.typeId) || defaultTicketType;
    const ticketDiscount = ticketType?.discount || 1.0;

    return (basePrice || 0) * zoneMultiplier * ticketDiscount;
};


export interface OccupiedSeatNode {
    row: number;
    col: number;
}

export const checkSeatAvailability = (
    r: number,
    c: number,
    grid: string[][],
    occupiedSeats: OccupiedSeatNode[] | undefined
): 'aisle' | 'taken' | null => {
    if (grid[r]?.[c] === 'aisle') {
        return 'aisle';
    }

    const isTaken = occupiedSeats?.some(s => s.row === r && s.col === c);
    if (isTaken) {
        return 'taken';
    }

    return null;
};


export interface UpdateSeatsResult {
    updatedSeats: SeatSelectionNode[];
    limitExceeded: boolean;
}

export const toggleSeatInCart = (
    currentSeats: SeatSelectionNode[],
    r: number,
    c: number,
    defaultTypeId: string | undefined,
    maxLimit: number = 99
): UpdateSeatsResult => {
    const isAlreadySelected = currentSeats.some(s => s.r === r && s.c === c);

    if (isAlreadySelected) {
        return {
            updatedSeats: currentSeats.filter(s => !(s.r === r && s.c === c)),
            limitExceeded: false
        };
    }

    if (currentSeats.length < maxLimit) {
        return {
            updatedSeats: [...currentSeats, { r, c, typeId: defaultTypeId }],
            limitExceeded: false
        };
    }

    return {
        updatedSeats: currentSeats,
        limitExceeded: true
    };
};
