import { type Showtime } from "./utils.ts";

export const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
};

export const groupShowtimesByDate = (showtimes: Showtime[]): Record<string, Showtime[]> => {
    return showtimes.reduce((groups: Record<string, Showtime[]>, showtime) => {
        const date = formatDateLabel(showtime.startTime);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(showtime);
        return groups;
    }, {});
};


export const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};