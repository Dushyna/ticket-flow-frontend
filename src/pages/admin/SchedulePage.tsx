import {useState} from 'react';
import {Calendar, Clock, CircleDollarSign, PlusCircle, LayoutDashboard, Film} from 'lucide-react';
import {
    useGetMoviesQuery,
    useUpsertShowtimeMutation
} from '../../features/cinema/services/movieApi';
import {useGetCinemasQuery, useGetHallsByCinemaQuery} from '../../features/cinema/services/cinemaApi';
import {useDispatch} from 'react-redux';
import {showNotification} from '../../features/notifications/slice/notificationSlice';
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import ShowtimeTimeline from "./ShowtimeTimeline.tsx";
import type {Showtime} from "../../features/cinema/utils/utils.ts";
import {useNavigate} from 'react-router-dom';

const SchedulePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {data: movies} = useGetMoviesQuery();
    const {data: cinemas} = useGetCinemasQuery();

    const [selectedCinema, setSelectedCinema] = useState('');
    const [selectedHall, setSelectedHall] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState(150);
    const [editingId, setEditingId] = useState<string | null>(null);

    const isPastTime = startTime ? new Date(startTime) < new Date() : false;

    const {data: halls, isLoading: isHallsLoading} = useGetHallsByCinemaQuery(selectedCinema, {skip: !selectedCinema});
    const [upsertShowtime, {isLoading: isCreating}] = useUpsertShowtimeMutation();

    const handleEditInitiated = (showtime: Showtime) => {
        setEditingId(showtime.id);

        setSelectedMovie(showtime.movieId);

        const date = new Date(showtime.startTime);
        const offset = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);

        setStartTime(localTime);
        setPrice(showtime.basePrice);

        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleCreate = async () => {
        if (!selectedMovie || !selectedHall || !startTime) {
            dispatch(showNotification({message: "Please fill all fields", type: "error"}));
            return;
        }

        if (isPastTime) {
            dispatch(showNotification({message: "Cannot schedule a showtime in the past!", type: "error"}));
            return;
        }

        try {
            await upsertShowtime({
                id: editingId || undefined,
                movieId: selectedMovie,
                hallId: selectedHall,
                startTime: new Date(startTime).toISOString(),
                basePrice: price
            }).unwrap();

            dispatch(showNotification({
                message: editingId ? "Showtime updated!" : "Showtime scheduled!",
                type: "success"
            }));
            setEditingId(null);
            setStartTime('');
            setSelectedMovie('');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;

            const errorData = fetchError.data as { message?: string };
            const errorMessage = errorData?.message || "";

            if (errorMessage.includes("Conflict")) {
                dispatch(showNotification({
                    message: "Conflict: This hall is already booked for the selected time slot!",
                    type: "error"
                }));
            } else if (fetchError.status === 403) {
                dispatch(showNotification({
                    message: "Access Denied: You don't have permission to manage this hall.",
                    type: "error"
                }));
            } else if (fetchError.status === 401) {
                dispatch(showNotification({
                    message: "Session expired. Please log in again.",
                    type: "error"
                }));
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                return;
            } else {
                dispatch(showNotification({
                    message: "Scheduling failed. Please check the data and try again.",
                    type: "error"
                }));
            }

            console.error("Showtime creation error:", fetchError);
        }
    };

    const selectedMovieData = movies?.find(m => m.id === selectedMovie);

    const getEndTimeString = (isoStart: string, duration: number) => {
        if (!isoStart || !duration) return '';
        const end = new Date(new Date(isoStart).getTime() + (duration + 15) * 60000);
        return end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="p-10 bg-slate-950 min-h-screen text-white flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 text-indigo-400">
                        <Calendar size={32} strokeWidth={2.5}/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Schedule <span className="text-indigo-500">Editor</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
                            Manage showtimes and hall availability
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Choose cinema and hall */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                                    <LayoutDashboard size={12}/> Cinema Location
                                </label>
                                <select
                                    value={selectedCinema}
                                    onChange={(e) => {
                                        setSelectedCinema(e.target.value);
                                        setSelectedHall('');
                                    }}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="">Select Cinema</option>
                                    {cinemas?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 text-white">
                                <label
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Hall</label>
                                <select
                                    value={selectedHall}
                                    onChange={(e) => setSelectedHall(e.target.value)}
                                    disabled={!selectedCinema || isHallsLoading}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all disabled:opacity-20 appearance-none"
                                >
                                    <option value="">{isHallsLoading ? 'Loading halls...' : 'Select Hall'}</option>
                                    {halls?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Choose movie and time */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-[10px] font-black uppercase tracking-widest  ml-2 flex items-center gap-2 text-white">
                                    <Film size={12}/> Movie to Screen
                                </label>
                                <select
                                    value={selectedMovie}
                                    onChange={(e) => setSelectedMovie(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all appearance-none"
                                >
                                    <option value="">Select Movie</option>
                                    {movies?.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                                        <Clock size={12}/> Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white"
                                    />
                                    {startTime && selectedMovieData && (
                                        <p className="text-[10px] text-indigo-400 font-bold mt-1 ml-2 italic">
                                            Ends ~{getEndTimeString(startTime, selectedMovieData.durationMinutes)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 text-white">
                                    <label
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                                        <CircleDollarSign size={12}/> Base Price
                                    </label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-10 w-full">
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setStartTime('');
                                    setSelectedMovie('');
                                }}
                                className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-3xl font-black uppercase italic transition-all"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button
                            onClick={handleCreate}
                            disabled={isCreating || isPastTime}
                            className={`w-full mt-10 py-5 rounded-3xl font-black uppercase italic transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 group ${
                                isCreating || isPastTime
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-white/5'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                            }`}
                        >
                            {isCreating ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"/>
                                    <span>Checking Availability...</span>
                                </>
                            ) : isPastTime ? (
                                <>
                                    <Clock size={20} className="text-red-500"/>
                                    <span className="text-red-500">Invalid: Time in Past</span>
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} strokeWidth={3}
                                                className="group-hover:rotate-90 transition-transform duration-300"/>
                                    <span>Schedule Showtime</span>
                                </>
                            )}
                            {editingId ? 'Update Showtime' : 'Schedule Showtime'}
                        </button>
                    </div>
                </div>

                <ShowtimeTimeline hallId={selectedHall} onEdit={handleEditInitiated}/>
            </div>
        </div>
    );
};

export default SchedulePage;
