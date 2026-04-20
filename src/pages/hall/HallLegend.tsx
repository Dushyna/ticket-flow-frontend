import type {ZoneConfig} from "./types.ts";
import {Eraser} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HallLegendProps {
    configs: ZoneConfig[];
}

const HallLegend = ({ configs }: HallLegendProps) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-8 bg-white/5 rounded-[32px] border border-white/10 shadow-inner">

            <div className="flex flex-col gap-5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{t('hall_legend.zones_title')}</span>
                <div className="grid grid-cols-2 gap-4">
                    {configs.map((zone) => (
                        <div key={zone.id} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded shadow-lg ${zone.color.replace('fill-', 'bg-')}`} />
                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">
                                {t(`zones.${zone.id}`) !== `zones.${zone.id}` ? t(`zones.${zone.id}`) : zone.label}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="pt-2 border-t border-white/5 mt-2">
                    <p className="text-[10px] text-slate-500 italic uppercase">
                        {t('hall_legend.zone_hint_start')} <b className="text-white text-nowrap italic"> {t('hall_legend.zone_hint_highlight')} </b> {t('hall_legend.zone_hint_end')}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-5 border-l border-white/10 pl-8">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{t('hall_legend.controls_title')}</span>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-600  shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                        <p className="text-[10px] text-slate-400 uppercase leading-relaxed font-medium">
                            <b className="text-white">{t('hall_legend.click_title')}:</b> {t('hall_legend.click_desc')}
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                        <p className="text-[10px] text-slate-400 uppercase leading-relaxed font-medium">
                            <b className="text-white text-nowrap italic">{t('hall_legend.numbers_title')}:</b> {t('hall_legend.numbers_desc')}
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-slate-500" />
                        <p className="text-[10px] text-slate-500 uppercase leading-relaxed font-medium">
                            {t('hall_legend.eraser_hint_start')} <b className="text-white italic"> <Eraser size={14} />{t('hall_legend.eraser_name')}</b> {t('hall_legend.eraser_hint_end')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallLegend;
