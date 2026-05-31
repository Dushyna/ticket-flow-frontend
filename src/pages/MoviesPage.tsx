import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetMoviesQuery, useGetAllShowtimesQuery } from '../features/cinema/services/movieApi';
import { useGetCinemasQuery } from '../features/cinema/services/cinemaApi';
import { formatDateLabel } from '../features/cinema/utils/dateTimeUtils.ts';

const MoviesPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: movies, isLoading: isMoviesLoading } = useGetMoviesQuery();
    const { data: showtimes, isLoading: isShowtimesLoading } = useGetAllShowtimesQuery();
    const { data: cinemas, isLoading: isCinemasLoading } = useGetCinemasQuery();

    const [selectedCity, setSelectedCity] = useState<string>(() => {
        return localStorage.getItem('user_selected_city') || 'All';
    });

    useEffect(() => {
        localStorage.setItem('user_selected_city', selectedCity);
    }, [selectedCity]);

    if (isMoviesLoading || isShowtimesLoading || isCinemasLoading) {
        return (
            <div className="h-64 flex items-center justify-center text-white font-black uppercase italic animate-pulse tracking-widest text-xl">
                {t('movies.loading', 'Loading movies...')}
            </div>
        );
    }

    const rawCities = cinemas?.map(c => c.address).filter(Boolean) || [];
    const cities = ['All', ...new Set(rawCities)];

    const filteredMovies = movies?.filter(movie => {
        if (selectedCity === 'All') return true;

        const cinemaIdsInCity = cinemas
            ?.filter(c => c.address.toLowerCase() === selectedCity.toLowerCase())
            .map(c => c.id) || [];

        return showtimes?.some(showtime =>
            showtime.movieId === movie.id && cinemaIdsInCity.includes(showtime.cinemaId)
        );
    }) || [];

    const getNearestShowtimeLabel = (movieId: string) => {
        const cinemaIdsInCity = cinemas
            ?.filter(c => selectedCity === 'All' || c.address.toLowerCase() === selectedCity.toLowerCase())
            .map(c => c.id) || [];

        const movieSessions = showtimes?.filter(s =>
            s.movieId === movieId &&
            cinemaIdsInCity.includes(s.cinemaId) &&
            new Date(s.startTime).getTime() > Date.now()
        ) || [];

        if (movieSessions.length === 0) return null;

        const sortedSessions = [...movieSessions].sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        return formatDateLabel(sortedSessions[0].startTime);
    };

    return (
        <div className="max-w-6xl w-full p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl text-white border border-white/10 animate-in fade-in duration-300">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black uppercase italic tracking-wide text-indigo-500">
                    {t('movies.title', 'Now Showing')}
                </h1>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        {t('movies.city_label', 'Your City:')}
                    </span>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="bg-slate-950 border border-white/10 p-2 px-4 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none cursor-pointer text-sm"
                    >
                        {cities.map(city => (
                            <option key={city} value={city}>
                                {city === 'All' ? t('movies.all_cities', 'All Cities') : city}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredMovies.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-slate-400 italic">
                        {t('movies.empty_state', 'No movies currently scheduled for this location.')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {filteredMovies.map((movie) => {
                        const nearestDate = getNearestShowtimeLabel(movie.id);

                        return (
                        <div
                            key={movie.id}
                            onClick={() => navigate(`/movies/${movie.id}/cinemas`)}
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-white/10 transition-all flex flex-col justify-between h-52 group shadow-lg"
                        >
                            <div>
                                <h3 className="font-black text-xl mb-2 group-hover:text-indigo-400 transition-colors uppercase italic tracking-wide line-clamp-2">
                                    {movie.title}
                                </h3>
                                {nearestDate && (
                                    <div className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-fit mb-3 uppercase tracking-wider">
                                        {t('movies.nearest', 'Next:')} {nearestDate}
                                    </div>
                                )}
                                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed font-medium">
                                    {movie.description}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
                                    {movie.durationMinutes} {t('movies.minutes_short', 'min')}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                    {t('movies.view_showtimes', 'View Showtimes')}
                                </span>
                            </div>
                        </div>
            );
            })}
                </div>
            )}
        </div>
    );
};

export default MoviesPage;
