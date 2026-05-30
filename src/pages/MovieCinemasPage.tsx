import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetShowtimesByMovieQuery } from '../features/cinema/services/movieApi';
import { useGetCinemasQuery } from '../features/cinema/services/cinemaApi';
import { type Showtime } from '../features/cinema/utils/utils';
import { groupShowtimesByDate } from '../features/cinema/utils/dateTimeUtils.ts';

interface CinemaWithSessions {
    id: string;
    name: string;
    address: string;
    dates: Record<string, Showtime[]>; // Grouped by formatted date label
}

const MovieCinemasPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: showtimes, isLoading: isShowtimesLoading } = useGetShowtimesByMovieQuery(movieId || '');
    const { data: cinemas, isLoading: isCinemasLoading } = useGetCinemasQuery();

    const [selectedCity] = useState<string>(() => {
        return localStorage.getItem('user_selected_city') || 'All';
    });

    if (isShowtimesLoading || isCinemasLoading) {
        return (
            <div className="h-64 flex items-center justify-center text-white font-black uppercase italic animate-pulse tracking-widest text-xl">
                {t('cinemas.loading', 'Loading schedule and locations...')}
            </div>
        );
    }

    const filteredCinemas = cinemas?.filter(cinema =>
        selectedCity === 'All' || cinema.address.toLowerCase() === selectedCity.toLowerCase()
    ) || [];

    // Map cinemas and group their specific showtimes by date safely
    const cinemasWithSessions: CinemaWithSessions[] = filteredCinemas.map(cinema => {
        const sessionsForThisCinema = showtimes?.filter(s => s.cinemaId === cinema.id) || [];

        // Using your custom helper utility to group arrays by date labels
        const groupedDates = groupShowtimesByDate(sessionsForThisCinema);

        return {
            id: cinema.id,
            name: cinema.name,
            address: cinema.address,
            dates: groupedDates
        };
    }).filter(c => Object.keys(c.dates).length > 0);

    return (
        <div className="max-w-4xl w-full p-8 bg-slate-900/90 backdrop-blur-xl rounded-[40px] border border-white/20 text-white shadow-2xl animate-in fade-in duration-300">
            <h2 className="text-4xl font-black mb-2 tracking-tight uppercase italic text-indigo-500">
                {t('cinemas.title', 'Available Showtimes')}
            </h2>
            <p className="text-slate-400 text-sm mb-8 font-medium italic">
                {t('cinemas.subtitle', 'Select your preferred cinema and session time to book seats.')}
            </p>

            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 w-fit text-sm font-bold text-slate-300 uppercase tracking-wider">
                {t('cinemas.current_city', 'Current City:')} <span className="text-indigo-400 italic ml-1">{selectedCity === 'All' ? t('cinemas.all_cities', 'All Cities') : selectedCity}</span>
            </div>

            <div className="space-y-8 text-left">
                {cinemasWithSessions.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-slate-400 italic">
                            {t('cinemas.empty_state', 'No available showtimes found for this selection.')}
                        </p>
                    </div>
                ) : (
                    cinemasWithSessions.map((cinema) => (
                        <div key={cinema.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group">
                            <h3 className="text-2xl font-black text-white mb-1 uppercase italic tracking-wide group-hover:text-indigo-400 transition-colors">
                                {cinema.name}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 font-medium布">
                                {t('cinemas.location', 'Location:')} <span className="text-indigo-400 font-bold">{cinema.address}</span>
                            </p>

                            {/* Render Grouped Dates inside each Cinema node container */}
                            <div className="space-y-6 mt-4">
                                {Object.entries(cinema.dates).map(([dateLabel, sessions]) => (
                                    <div key={dateLabel} className="border-t border-white/5 pt-4 first:border-0 first:pt-0">
                                        <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-3 italic">
                                            {dateLabel}
                                        </span>
                                        <div className="flex flex-wrap gap-3">
                                            {sessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => navigate(`/hall/book/${session.id}`)}
                                                    className="px-5 py-3 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white font-bold rounded-xl transition-all active:scale-95 shadow-md text-left min-w-[100px]"
                                                >
                                                    <div className="text-base font-black">
                                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </div>
                                                    <span className="block text-[10px] text-slate-400 font-normal mt-0.5 group-hover:text-indigo-200">
                                                        {session.hallName}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MovieCinemasPage;
