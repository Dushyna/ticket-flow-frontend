import { useState } from 'react';
import {
    useGetMoviesQuery,
    useCreateMovieMutation,
    useDeleteMovieMutation
} from '../../features/cinema/services/movieApi';
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

const MovieManagementPage = () => {
    const { t } = useTranslation();
    const { data: movies, isLoading } = useGetMoviesQuery();
    const [createMovie, { isLoading: isCreating }] = useCreateMovieMutation();
    const [deleteMovie] = useDeleteMovieMutation();

    const [newMovie, setNewMovie] = useState({ title: '', durationMinutes: 120, description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<{ id: string, title: string } | null>(null);

    const handleAdd = async () => {
        if (!newMovie.title.trim()) return;
        try {
            await createMovie(newMovie).unwrap();
            setNewMovie({ title: '', durationMinutes: 120, description: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        if (movieToDelete) {
            await deleteMovie(movieToDelete.id).unwrap();
            setIsModalOpen(false);
            setMovieToDelete(null);
        }
    };

    return (
        <div className="p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl max-w-6xl w-full text-white animate-in fade-in duration-500">
            <h1 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">
                {t('movies.title_main')} <span className="text-indigo-500">{t('movies.title_accent')}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form Section */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 h-fit">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-indigo-400">
                        {t('movies.add_title')}
                    </h2>

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                            {t('movies.label_title')}
                        </label>
                        <input
                            value={newMovie.title}
                            onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
                            placeholder={t('movies.placeholder_title')}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                            {t('movies.label_duration')} <span className="text-indigo-500">({t('movies.unit_min')})</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={newMovie.durationMinutes}
                                onChange={e => setNewMovie({ ...newMovie, durationMinutes: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-white/10 p-4 pr-16 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-600 pointer-events-none">
                                {t('movies.unit_min')}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isCreating}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 rounded-2xl font-black uppercase italic transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 group"
                    >
                        {isCreating ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <PlusCircle size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span>{t('movies.btn_add')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-2 ml-2 text-slate-500">
                        {t('movies.list_title')}
                    </h2>

                    {isLoading && (
                        <div className="p-10 text-center animate-pulse text-slate-500 font-black uppercase italic tracking-tighter">
                            {t('common.loading')}
                        </div>
                    )}

                    {!isLoading && movies?.map(movie => (
                        <div key={movie.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-red-500/30 transition-all">
                            <div className="flex flex-col">
                                <span className="font-bold group-hover:text-indigo-300 transition-colors">{movie.title}</span>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                    {movie.durationMinutes} {t('movies.unit_min')}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setMovieToDelete({ id: movie.id, title: movie.title });
                                    setIsModalOpen(true);
                                }}
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl md:opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {!isLoading && movies?.length === 0 && (
                        <div className="text-slate-600 italic text-sm p-10 border border-dashed border-white/10 rounded-2xl text-center">
                            {t('movies.empty_list')}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <ConfirmModal
                    title={t('movies.modal_delete_title')}
                    message={t('movies.modal_delete_msg', { title: movieToDelete?.title })}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsModalOpen(false)}
                    confirmText={t('common.delete')}
                    cancelText={t('common.cancel')}
                />
            )}
        </div>
    );
};

export default MovieManagementPage;
