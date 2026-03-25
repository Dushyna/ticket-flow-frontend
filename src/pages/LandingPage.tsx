import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-12 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center max-w-2xl transform transition-all hover:scale-[1.01]">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                Professional Cinema Management
            </div>

            <h1 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
                Ticket<span className="text-indigo-500">Flow</span>
            </h1>

            <p className="text-slate-200 text-xl font-medium mb-10 leading-relaxed max-w-lg mx-auto">
                The ultimate SaaS platform for managing movie tickets, theater schedules, and customer support with ease.
            </p>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1 active:scale-95"
                >
                    Get Started Free
                </button>
                <button
                    onClick={() => navigate('/about')} // Теперь ведет на /about
                    className="px-10 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md active:scale-95"
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
