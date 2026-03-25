import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {type ViewMode} from './types.ts'


const AboutPage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('viewer');

    const content: Record<ViewMode, {
        title: string;
        subtitle: string;
        features: { title: string; desc: string; icon: string; }[];
        cta: string;
        path: string;
    }> = {
        viewer: {
            title: 'For Movie Lovers',
            subtitle: 'Find the best seats and enjoy your favorite movies.',
            features: [
                { title: 'Easy Booking', desc: 'Pick your seat in seconds with our interactive map.', icon: '🍿' },
                { title: 'Instant Tickets', desc: 'Get your QR-code ticket immediately after payment.', icon: '🎟️' },
                { title: 'Reminders', desc: 'Never miss a show with our smart notification system.', icon: '🔔' },
                { title: 'Loyalty Program', desc: 'Collect points and get free popcorn or discounts.', icon: '✨' }
            ],
            cta: 'Start Browsing Movies',
            path: '/movies' // Представим, что тут список фильмов
        },
        owner: {
            title: 'For Cinema Owners',
            subtitle: 'Powerful tools to scale your cinema business.',
            features: [
                { title: 'Smart Scheduling', desc: 'Manage movie sessions and hall layouts with ease.', icon: '📅' },
                { title: 'Real-time Analytics', desc: 'Track ticket sales and revenue in one dashboard.', icon: '📈' },
                { title: 'Hall Designer', desc: 'Create custom seat layouts for any type of theater.', icon: '🏗️' },
                { title: 'Cloud Access', desc: 'Manage everything from anywhere, on any device.', icon: '☁️' }
            ],
            cta: 'Register as Partner',
            path: '/register'
        }
    };

    const active = content[viewMode];

    return (
        <div className="max-w-5xl w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">

            {/* Переключатель Ролей */}
            <div className="inline-flex p-1.5 mb-10 bg-black/20 rounded-2xl border border-white/10">
                <button
                    onClick={() => setViewMode('viewer')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'viewer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    I am a Viewer
                </button>
                <button
                    onClick={() => setViewMode('owner')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'owner' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    I am an Owner
                </button>
            </div>

            <h2 className="text-5xl font-black text-white mb-4 tracking-tight uppercase italic">
                {active.title}
            </h2>
            <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto font-medium italic">
                {active.subtitle}
            </p>

            {/* Сетка преимуществ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                {active.features.map((f, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-indigo-500/10 transition-all group">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                        <h4 className="text-white font-bold text-lg mb-1">{f.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => navigate(active.path)}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all active:scale-95"
                >
                    {active.cta}
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default AboutPage;
