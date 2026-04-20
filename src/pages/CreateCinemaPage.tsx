import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCinemaMutation } from '../features/cinema/services/cinemaApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Loader2 } from "lucide-react";

const CreateCinemaPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });

    const [createCinema, { isLoading }] = useCreateCinemaMutation();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            await createCinema(formData).unwrap();

            dispatch(showNotification({
                message: t('cinema_create.success_msg', { name: formData.name }),
                type: 'success'
            }));

            navigate('/dashboard');
        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({
                message: errorData.data?.message || t('cinema_create.error_failed'),
                type: 'error'
            }));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-6">
            <div className="max-w-xl w-full p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl text-white">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        {t('cinema_create.title_start')} <span className="text-indigo-500">{t('cinema_create.title_end')}</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        {t('cinema_create.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Cinema Name */}
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4">
                            <Building2 size={12} />
                            {t('cinema_create.label_name')}
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('cinema_create.placeholder_name')}
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-lg font-bold placeholder:text-slate-700"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4">
                            <MapPin size={12} />
                            {t('cinema_create.label_address')}
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder={t('cinema_create.placeholder_address')}
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-lg font-bold placeholder:text-slate-700"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-50 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {t('common.processing')}
                                </>
                            ) : t('cinema_create.btn_submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCinemaPage;
