import {Film, Clock, Trash2, Edit2} from 'lucide-react';
import {useGetShowtimesByHallQuery, useDeleteShowtimeMutation} from '../../features/cinema/services/movieApi';
import type {Showtime} from '../../features/cinema/utils/utils.ts';
import {showNotification} from "../../features/notifications/slice/notificationSlice.ts";
import {useDispatch} from "react-redux";
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {useState} from "react";
import ConfirmModal from "../../components/ConfirmModal.tsx";

interface ShowtimeTimelineProps {
    hallId: string;
    onEdit: (showtime: Showtime) => void;
}

const ShowtimeTimeline = ({hallId, onEdit}: ShowtimeTimelineProps) => {
    const dispatch = useDispatch();
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);

    const {data: existingShowtimes, isLoading: isShowtimesLoading} =
        useGetShowtimesByHallQuery(hallId, {skip: !hallId});

    const [deleteShowtime, {isLoading: isDeleting}] = useDeleteShowtimeMutation();

    const handleConfirmDelete = async () => {
        if (!showtimeToDelete) return;

        try {
            await deleteShowtime(showtimeToDelete.id).unwrap();
            dispatch(showNotification({message: "Showtime removed from schedule", type: "success"}));
            setShowtimeToDelete(null);
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || 'Failed to delete showtime. Please try again.';

            dispatch(showNotification({message: errorMessage, type: "error"}));
        }
    };

    const sortedShowtimes = existingShowtimes
        ? [...existingShowtimes].sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
        : [];

    if (!hallId) return null;


    return (
        <div className="mt-16 w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-8 border-l-4 border-indigo-500 pl-6">
                <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                        Hall <span className="text-indigo-500">Timeline</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-1">
                        Confirmed showtimes for this location
                    </p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl">
                    <span className="text-indigo-400 font-black text-sm">
                        {existingShowtimes?.length || 0} PLANNED
                    </span>
                </div>
            </div>

            <div className="grid gap-4">
                {isShowtimesLoading ? (
                    <div className="h-24 bg-white/5 rounded-3xl animate-pulse border border-white/10"/>
                ) : sortedShowtimes.length === 0 ? (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-[40px] py-16 text-center">
                        <p className="text-slate-600 font-black uppercase text-xs tracking-[0.3em]">No shows scheduled
                            yet</p>
                    </div>
                ) : (
                    sortedShowtimes?.map((st: Showtime) => (
                        <div key={st.id}
                             className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 p-6 rounded-[32px] flex items-center justify-between transition-all backdrop-blur-md">
                            <div className="flex items-center gap-6">
                                <div
                                    className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                    <Film size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg uppercase tracking-tight italic">
                                        {st.movieTitle}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div
                                            className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                                            <Clock size={12}/>
                                            {new Date(st.startTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            —
                                            {new Date(st.endTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <span
                                            className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                            {new Date(st.startTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-1 text-white">
                                    <span className="text-slate-500 font-bold text-xs">$</span>
                                    <span className="text-2xl font-black">{st.basePrice}</span>
                                </div>
                                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">Price
                                    Tier</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => onEdit(st)}
                                    className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Edit2 size={18}/>
                                </button>
                                <button
                                    onClick={() => setShowtimeToDelete(st)}
                                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showtimeToDelete && (
                <ConfirmModal
                    title="Delete Showtime"
                    message={`Are you sure you want to remove the session for "${showtimeToDelete.movieTitle}"? This cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowtimeToDelete(null)}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

export default ShowtimeTimeline;
