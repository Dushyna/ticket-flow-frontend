import { type Showtime } from "./utils.ts";

export const formatDateLabel = (dateStr: string, locale: string = 'en-GB'): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
};

export const groupShowtimesByDate = (showtimes: Showtime[], locale: string = 'en-GB'): Record<string, Showtime[]> => {
    return showtimes.reduce((groups: Record<string, Showtime[]>, showtime) => {
        const date = formatDateLabel(showtime.startTime, locale);
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