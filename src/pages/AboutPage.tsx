import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ViewMode } from './types.ts';
import { useAppSelector } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';
import {
    Popcorn, Ticket, Bell, Sparkles,
    Calendar, LineChart, Construction, Cloud,
    ChevronLeft
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    popcorn: Popcorn,
    ticket: Ticket,
    bell: Bell,
    sparkles: Sparkles,
    calendar: Calendar,
    chart: LineChart,
    construction: Construction,
    cloud: Cloud
};

const AboutPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [viewMode, setViewMode] = useState<ViewMode>('viewer');

    const title = t(`about.${viewMode}.title`);
    const subtitle = t(`about.${viewMode}.subtitle`);
    const cta = viewMode === 'owner' && isAuthenticated
        ? t('about.owner.cta_dashboard')
        : t(`about.${viewMode}.cta`);

    const path = viewMode === 'owner' && isAuthenticated ? '/dashboard' : (viewMode === 'viewer' ? '/movies' : '/register');

    const features = t(`about.${viewMode}.features`, { returnObjects: true }) as Array<{title: string, desc: string, iconKey: string}>;

    return (
        <div className="max-w-5xl w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">

            <div className="inline-flex p-1.5 mb-10 bg-black/20 rounded-2xl border border-white/10">
                <button
                    onClick={() => setViewMode('viewer')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'viewer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    {t('about.toggle_viewer')}
                </button>
                <button
                    onClick={() => setViewMode('owner')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'owner' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    {t('about.toggle_owner')}
                </button>
            </div>

            <h2 className="text-5xl font-black text-white mb-4 tracking-tight uppercase italic">
                {title}
            </h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto font-medium italic">
                {subtitle}
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                {Array.isArray(features) && features.map((f, i) => {
                    const IconComponent = iconMap[f.iconKey];
                    return (
                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-indigo-500/10 transition-all group">
                            <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                {IconComponent && <IconComponent className="text-indigo-400" size={28} />}
                            </div>
                            <h4 className="text-white font-bold text-lg mb-1">{f.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => navigate(path)}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                    {cta}
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-10 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                    <ChevronLeft size={18} />
                    {t('common.go_back')}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;
