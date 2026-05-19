import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../features/auth/slice/authSlice';
import { Calendar, Film, LayoutDashboard, LogOut, User, Armchair, UserCog, Shield } from "lucide-react"; // ADDED: Shield icon
import LanguageSwitcher from "./LanguageSwitcher.tsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/');
    };

    // Derived flags for granular security layout rendering execution paths
    const isManagement = user?.role === 'ROLE_SUPER_ADMIN' || user?.role === 'ROLE_TENANT_ADMIN';
    const isCashier = user?.role === 'ROLE_CASHIER';
    const isController = user?.role === 'ROLE_CONTROLLER';

    // --- FIXED: Expand nav menu block to display for anyone who has official staff permissions ---
    const hasNavMenu = isManagement || isCashier || isController;

    return (
        <header
            className="w-full py-4 px-8 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <Link to="/"
                  className="text-2xl font-black text-white tracking-tighter hover:text-indigo-400 transition-colors">
                TICKET<span className="text-indigo-500">FLOW</span>
            </Link>

            <div className="flex items-center gap-6">
                <LanguageSwitcher/>

                {user ? (
                    <div className="flex items-center gap-6">

                        {/* --- CONDITIONAL NAVIGATION BLOCK --- */}
                        {hasNavMenu && (
                            <nav className="flex items-center gap-6 border-r border-white/10 pr-6">

                                {/* CASE A: ADMINISTRATION / SYSTEM MANAGEMENT VIEW LINKS */}
                                {isManagement && (
                                    <>
                                        <Link to="/dashboard"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            <LayoutDashboard size={14} className="text-indigo-500"/>
                                            {t('nav.dashboard')}
                                        </Link>

                                        {/* --- ADDED: Owner quick access view path mapping to Cashier Cabinet workspace --- */}
                                        <Link to="/cashier"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <Armchair size={14} className="text-emerald-500"/>
                                            <span>{t('nav.box_office', 'Box Office')}</span>
                                        </Link>

                                        {/* --- ADDED: Owner quick access view path mapping to Controller Gate control entry --- */}
                                        <Link to="/controller"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors">
                                            <Shield size={14} className="text-amber-500"/>
                                            <span>{t('nav.controller_gate', 'Gate Control')}</span>
                                        </Link>

                                        <Link to="/admin/movies"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            <Film size={14} className="text-indigo-500"/>
                                            <span>{t('nav.movies')}</span>
                                        </Link>

                                        <Link to="/admin/schedule"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            <Calendar size={14} className="text-indigo-500"/>
                                            <span>{t('nav.schedule')}</span>
                                        </Link>

                                        <Link to="/admin/users"
                                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                            <UserCog size={14} className="text-indigo-500"/>
                                            <span>{t('nav.users', 'Staff')}</span>
                                        </Link>
                                    </>
                                )}

                                {/* CASE B: ISOLATED WORKSPACE LINK FOR COMPLIANT CASHIER STAFF */}
                                {isCashier && (
                                    <Link to="/cashier" // Points to your exact cashier node view route
                                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors animate-pulse">
                                        <Armchair size={14} className="text-indigo-500"/>
                                        <span>{t('nav.box_office', 'Box Office')}</span>
                                    </Link>
                                )}

                                {/* --- NEW CASE C: ISOLATED WORKSPACE LINK FOR THE DOOR CONTROLLER STAFF --- */}
                                {isController && (
                                    <Link to="/controller"
                                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors animate-pulse">
                                        <Shield size={14} className="text-indigo-500"/>
                                        <span>{t('nav.controller_gate', 'Gate Control')}</span>
                                    </Link>
                                )}

                            </nav>
                        )}

                        {/* User Identity Display Node block */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-white/5 transition-all"
                            >
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">
                                        {t('login.logged_in_as')}
                                    </span>
                                    <span className="text-[11px] font-bold text-white tracking-tight leading-none italic group-hover:text-indigo-400 transition-colors">
                                        {user.email}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-500 transition-all">
                                    <User size={16} className="text-indigo-400"/>
                                </div>
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl active:scale-95"
                            >
                                <LogOut size={14}/>
                                {t('nav.logout')}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* (SIGN IN / REGISTER UI ACTION TRIGGER BUTTONS) */
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-bold text-white hover:text-indigo-300 transition-colors"
                        >
                            {t('login.title')}
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            {t('login.register_link')}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
