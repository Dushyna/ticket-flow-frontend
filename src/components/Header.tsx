import {Link, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {type RootState} from '../app/store';
import {logOut} from '../features/auth/slice/authSlice';
import {Calendar, Film, LayoutDashboard, LogOut} from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/');
    };

    return (
        <header
            className="w-full py-4 px-8 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <Link to="/"
                  className="text-2xl font-black text-white tracking-tighter hover:text-indigo-400 transition-colors">
                TICKET<span className="text-indigo-500">FLOW</span>
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    /* (ADMIN / MANAGER) */
                    <div className="flex items-center gap-6">
                        {/* Navigate Admin */}
                        <nav className="flex items-center gap-6 border-r border-white/10 pr-6">
                            <Link to="/dashboard"
                                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                <LayoutDashboard size={14} className="text-indigo-500"/>
                                Dashboard
                            </Link>

                            <Link to="/admin/movies"
                                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                <Film size={14} className="text-indigo-500"/>
                                <span>Movies</span>
                            </Link>

                            <Link to="/admin/schedule"
                                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                <Calendar size={14} className="text-indigo-500"/>
                                <span>Schedule</span>
                            </Link>
                        </nav>

                        {/* (Email) */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span
                                    className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">
                                    Logged in as
                                </span>
                                <span className="text-[11px] font-bold text-white tracking-tight leading-none italic">
                                    {user.email}
                                </span>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl active:scale-95"
                            >
                                <LogOut size={14}/>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    /* (SIGN IN / REGISTER) */
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
                )}
            </div>
        </header>
    );
};

export default Header;
