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
