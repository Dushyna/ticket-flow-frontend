import {useNavigate} from 'react-router-dom';
import {useGetCinemasQuery} from "../features/cinema/services/cinemaApi.ts";
import CinemaCard from "../components/CinemaCard.tsx";
import {QrCode, Ticket, Users} from "lucide-react";
import {useTranslation} from 'react-i18next';
import {useAppSelector} from "../app/hooks.ts";

const DashboardPage = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {data: cinemas, isLoading} = useGetCinemasQuery();

    const {user} = useAppSelector((state) => state.auth);

    const isAdmin = user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'ROLE_TENANT_ADMIN';


    return (
        <div
            className="p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl max-w-5xl w-full text-white">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                    {t('dashboard.title_my')} <span className="text-indigo-500">{t('dashboard.title_theaters')}</span>
                </h1>
                <div className="flex flex-wrap gap-4">

                    {isAdmin && (
                        <>
                            <button
                                onClick={() => navigate('/cashier')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-emerald-400 hover:text-white shadow-xl"
                            >
                                <Ticket size={14}/>
                                {t('dashboard.btn_cashier_workspace', 'Open Cashier')}
                            </button>

                            <button
                                onClick={() => navigate('/controller')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-amber-600 border border-white/10 hover:border-amber-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-amber-400 hover:text-white shadow-xl"
                            >
                                <QrCode size={14}/>
                                {t('dashboard.btn_gate_control', 'Gate Control')}
                            </button>

                            <button
                                onClick={() => navigate('/admin/users')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-indigo-400 hover:text-white shadow-xl"
                            >
                                <Users size={14}/>
                                {t('dashboard.btn_manage_staff', 'Staff Control')}
                            </button>
                            <button
                                onClick={() => navigate('/admin/tickets')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                            >
                                <Ticket size={14} className="text-indigo-400"/>
                                {t('dashboard.btn_pricing')}
                            </button>
                            <button
                                onClick={() => navigate('/cinema/create')}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                            >
                                {t('dashboard.btn_add_cinema')}
                            </button>
                            <button
                                onClick={() => navigate('/cinema/create-hall')}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                {t('dashboard.btn_create_hall')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading && (
                    <div
                        className="col-span-2 py-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-widest">
                        {t('common.loading')}
                    </div>
                )}

                {!isLoading && cinemas && cinemas.length > 0 ? (
                    cinemas.map((cinema) => (
                        <CinemaCard key={cinema.id} cinema={cinema}/>
                    ))
                ) : (

                    !isLoading && (
                        <div
                            className="col-span-2 p-12 bg-white/5 border border-white/10 border-dashed rounded-3xl text-center">
                            <p className="text-slate-400 italic mb-4">No cinemas found.</p>
                            <p className="text-sm text-indigo-300 uppercase font-black tracking-widest">
                                {t('dashboard.empty_hint')}
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
