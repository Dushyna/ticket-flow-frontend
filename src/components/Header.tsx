import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="w-full py-4 px-8 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter hover:text-indigo-400 transition-colors">
                TICKET<span className="text-indigo-500">FLOW</span>
            </Link>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 text-sm font-bold text-white hover:text-indigo-300 transition-colors"
                >
                    Sign In
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95"
                >
                    Register
                </button>
            </div>
        </header>
    );
};

export default Header;
