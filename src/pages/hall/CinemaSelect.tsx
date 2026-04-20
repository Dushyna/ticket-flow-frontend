import { useGetCinemasQuery } from '../../features/cinema/services/cinemaApi';
import { useTranslation } from 'react-i18next';

interface CinemaSelectProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

const CinemaSelect = ({ selectedId, onSelect }: CinemaSelectProps) => {
    const { t } = useTranslation();
    const { data: cinemas, isLoading, isError } = useGetCinemasQuery();

    if (isLoading) return (
        <div className="h-10 px-4 flex items-center bg-white/5 rounded-xl border border-white/10 animate-pulse">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                {t('cinema_select.loading')}
            </span>
        </div>
    );

    if (isError || !cinemas || cinemas.length === 0) return (
        <div className="h-10 px-4 flex items-center bg-red-500/10 rounded-xl border border-red-500/20">
            <span className="text-[10px] font-black uppercase text-red-400 tracking-widest italic">
                {t('cinema_select.error_empty')}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">
                {t('cinema_select.label')}
            </label>
            <select
                value={selectedId}
                onChange={(e) => onSelect(e.target.value)}
                className="h-12 px-4 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-inner"
                style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,<svg xmlns='https://w3.org' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1em'
                }}
            >
                <option value="" disabled className="bg-slate-950 text-slate-500">
                    {t('cinema_select.placeholder')}
                </option>
                {cinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id} className="bg-slate-950 text-white">
                        {cinema.name} — {cinema.address.split(',')[0]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CinemaSelect;
