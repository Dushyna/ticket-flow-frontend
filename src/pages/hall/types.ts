export type ZoneType = string;

export interface ZoneConfig {
    id: string;
    label: string;
    color: string;
    glow: string;
    multiplier: number;
}



export const INITIAL_ZONES: ZoneConfig[] = [
    { id: 'parterre', label: 'Parterre', color: '#2563eb', glow: 'rgba(37, 99, 235, 0.4)', multiplier: 1.0 },
    { id: 'amphitheater', label: 'Amphitheater', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', multiplier: 0.7 },
    { id: 'balcony', label: 'Balcony', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', multiplier: 1.0 },
    { id: 'lodge', label: 'VIP Lodge', color: '#67e8f9', glow: 'rgba(103, 232, 249, 0.4)', multiplier: 2.0 },
];

export interface SizeInputProps {
    label: string;
    val: number;
    onChange: (v: number) => void;
}

