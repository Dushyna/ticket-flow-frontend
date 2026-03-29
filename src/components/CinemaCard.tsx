import { useGetHallsByCinemaQuery } from '../features/cinema/services/cinemaApi';
import { useNavigate } from 'react-router-dom';
import { type Cinema } from '../features/cinema/utils/utils';

const CinemaCard = ({ cinema }: { cinema: Cinema }) => {
    const navigate = useNavigate();
    const { data: halls, isLoading } = useGetHallsByCinemaQuery(cinema.id);

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
                    Edit Info
                </button>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/50 mb-2">Movie Halls</h4>

                {isLoading && <div className="text-xs text-slate-600 animate-pulse uppercase">Loading halls...</div>}

                {halls && halls.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {halls.map(hall => (
                            <div
                                key={hall.id}
                                onClick={() => navigate(`/cinema/edit-hall/${hall.id}`)}
                                className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group/hall"
                            >
                                <span className="text-sm font-bold text-slate-300 group-hover/hall:text-white transition-colors">
                                    {hall.name}
                                </span>
                                <span className="text-[10px] font-black text-slate-600 uppercase italic">
                                    {hall.rowsCount}x{hall.colsCount} • Edit Layout →
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isLoading && <div className="text-xs text-slate-600 italic">No halls created yet</div>
                )}
            </div>
        </div>
    );
};

export default CinemaCard;
