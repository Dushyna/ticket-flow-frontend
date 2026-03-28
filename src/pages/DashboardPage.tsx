import {useNavigate} from 'react-router-dom';
import {useGetCinemasQuery} from "../features/cinema/services/cinemaApi.ts";

const DashboardPage = () => {
    const navigate = useNavigate();
    const {data: cinemas, isLoading} = useGetCinemasQuery();

    return (
        <div
            className="p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl max-w-5xl w-full text-white">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                    My <span className="text-indigo-500">Theaters</span>
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/cinema/create')} 
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                        + Add Cinema
                    </button>
                    <button
                        onClick={() => navigate('/cinema/create-hall')}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        + Create New Hall
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading && (
                    <div className="col-span-2 py-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-widest">
                        Loading your theaters...
                    </div>
                )}

                {!isLoading && cinemas && cinemas.length > 0 ? (
                    cinemas.map((cinema) => (
                        <div
                            key={cinema.id}
                            className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-indigo-500/50 transition-all group cursor-pointer"
                        >
                            <h3 className="text-2xl font-black uppercase italic group-hover:text-indigo-400 transition-colors">
                                {cinema.name}
                            </h3>
                            <p className="text-slate-400 text-sm italic mt-2">{cinema.address || 'No address'}</p>
                        </div>
                    ))
                ) : (

                    !isLoading && (
                        <div className="col-span-2 p-12 bg-white/5 border border-white/10 border-dashed rounded-3xl text-center">
                            <p className="text-slate-400 italic mb-4">No cinemas found.</p>
                            <p className="text-sm text-indigo-300 uppercase font-black tracking-widest">
                                Click "+ Add Cinema" to start!
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
