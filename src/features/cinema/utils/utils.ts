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
