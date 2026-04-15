import { useGetHallsByCinemaQuery } from '../features/cinema/services/cinemaApi';
import { useNavigate } from 'react-router-dom';
import {useGetShowtimesByCinemaQuery} from "../features/cinema/services/movieApi.ts";
import { type Cinema } from '../features/cinema/utils/utils';
import { Ticket, Settings, Calendar} from "lucide-react";
import { groupShowtimesByDate, formatTime } from '../features/cinema/utils/dateTimeUtils';

const CinemaCard = ({ cinema }: { cinema: Cinema }) => {
    const navigate = useNavigate();
    const { data: halls, isLoading: isHallsLoading  } = useGetHallsByCinemaQuery(cinema.id);
    const { data: showtimes, isLoading: isShowtimesLoading } = useGetShowtimesByCinemaQuery(cinema.id);

    const groupedSessions = showtimes ? groupShowtimesByDate(showtimes) : {};
    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black uppercase italic group-hover:text-indigo-400 transition-colors">
                        {cinema.name}
                    </h3>
                    <p className="text-slate-400 text-sm italic mt-1">{cinema.address || 'No address'}</p>
                </div>
                <button
                    onClick={() => navigate(`/cinema/edit/${cinema.id}`)}
                    className="text-[10px] font-bold uppercase text-slate-500 hover:text-white transition-colors"
                >
                    Edit Cinema
                </button>
            </div>

            {/* SECTION: USER - SHOWTIMES */}
            <div className="mb-8">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">
                    <Calendar size={12} /> Upcoming Schedule
                </h4>

                {isShowtimesLoading ? (
                    <div className="text-[10px] text-slate-600 animate-pulse font-black uppercase">Retrieving sessions...</div>
                ) : Object.keys(groupedSessions).length > 0 ? (
                    <div className="space-y-6">
                        {Object.entries(groupedSessions).map(([dateLabel, sessions]) => (
                            <div key={dateLabel} className="space-y-3">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">
                                    {dateLabel}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {sessions.map((st) => (
                                        <button
                                            key={st.id}
                                            onClick={() => navigate(`/hall/book/${st.id}`)}
                                            className="group/btn relative overflow-hidden px-4 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl hover:bg-indigo-600 transition-all text-left min-w-[120px]"
                                        >
                                            <div className="text-[9px] font-black text-indigo-400 group-hover/btn:text-indigo-200 uppercase leading-none mb-1">
                                                {st.movieTitle}
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-lg font-black text-white leading-none">
                                                    {formatTime(st.startTime)}
                                                </div>
                                                <Ticket size={14} className="text-indigo-500/50 group-hover/btn:text-white transition-colors" />
                                            </div>
                                            <div className="text-[8px] font-bold text-slate-500 group-hover/btn:text-white/50 mt-1 uppercase">
                                                {st.hallName} • ${st.basePrice}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-[10px] text-slate-600 font-bold uppercase italic border border-white/5 p-4 rounded-2xl text-center">
                        No active sessions found
                    </div>
                )}
            </div>


            {/* SECTION: ADMIN - HALLS */}
            <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/50 mb-2">Halls Layout</h4>

                {isHallsLoading && <div className="text-xs text-slate-600 animate-pulse uppercase">Loading halls...</div>}

                {halls && halls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {halls.map(hall => (
                            <div
                                key={hall.id}
                                className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group/hall"
                            >
                                <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-300 group-hover/hall:text-white transition-colors">
                                    {hall.name}
                                </span>
                                <span className="text-[10px] font-black text-slate-600 uppercase italic">
                                    {hall.rowsCount}x{hall.colsCount} • Edit Layout →
                                </span>
                            </div>
                                <div className="flex gap-2">

                                    {/* Admin button - Edit */}
                                    <button
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            navigate(`/cinema/edit-hall/${hall.id}`)}
                                        }
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
                                        title="Edit Layout"
                                    >
                                        <Settings
                                            size={14}
                                            className="text-slate-500 group-hover/settings:text-indigo-400 transition-colors"
                                        />
                                </button>
                            </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isHallsLoading && <div className="text-xs text-slate-600 italic">No halls created yet</div>
                )}
            </div>
        </div>
    );
};

export default CinemaCard;
