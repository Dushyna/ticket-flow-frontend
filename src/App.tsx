import { useEffect, Suspense } from 'react';
import {BrowserRouter, Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import { useGetCurrentUserQuery } from './features/auth/services/authApi';
import { setCredentials, logOut } from './features/auth/slice/authSlice';
import { type RootState } from './app/store';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmPage from './pages/ConfirmPage';
import NotificationModal from './components/NotificationModal';
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import CreateHallPage from "./pages/hall/CreateHallPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import CreateCinemaPage from "./pages/CreateCinemaPage.tsx";
import HallBookingPage from "./pages/booking/HallBookingPage.tsx";
import MovieManagementPage from "./pages/admin/MovieManagementPage.tsx";
import SchedulePage from "./pages/admin/SchedulePage.tsx";
import TicketTypesPage from "./pages/admin/TicketTypesPage.tsx";
import {useAppDispatch, useAppSelector} from "./app/hooks.ts";
import PaymentSuccess from "./pages/booking/PaymentSuccess.tsx";
import PaymentCancel from "./pages/booking/PaymentCancel.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import { AdminUserManagement } from "./pages/admin/AdminUserManagement.tsx";
import { CashierCabinet } from "./pages/admin/CashierCabinet.tsx";
import { ControllerCabinet } from "./pages/admin/ControllerCabinet.tsx";
import MoviesPage from "./pages/MoviesPage.tsx";
import MovieCinemasPage from "./pages/MovieCinemasPage.tsx";
import {useTranslation} from "react-i18next";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ROLE_USER') {
                navigate('/movies');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, isAuthenticated, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
            <div className="text-xl font-black text-indigo-500 animate-pulse uppercase italic">
                {t('login.google_sync', 'Syncing with Google...')}
            </div>
        </div>
    );
};

const AppContent = () => {
    const dispatch = useAppDispatch();
    const { data: user, isSuccess, isError, isLoading } = useGetCurrentUserQuery();

    const auth = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isSuccess && user) {
            dispatch(setCredentials(user));
        } else if (isError) {
            dispatch(logOut());
        }
    }, [user, isSuccess, isError, dispatch]);

    if (isLoading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase italic animate-pulse">
                Checking Session...
            </div>
        );
    }

    const isAdmin = auth.user?.role === 'ROLE_SUPER_ADMIN' || auth.user?.role === 'ROLE_TENANT_ADMIN';
    const isCashier = auth.user?.role === 'ROLE_CASHIER';

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
            style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/theater.jpg')"
            }}
        >
            <Header />
            <main className="flex-1 flex items-center justify-center py-10">
                <NotificationModal />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/confirm/:code" element={<ConfirmPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/cinema/create-hall" element={<CreateHallPage />} />
                    <Route path="/cinema/edit-hall/:hallId" element={<CreateHallPage />} />
                    <Route path="/cinema/create" element={<CreateCinemaPage />} />
                    <Route path="/admin/movies" element={<MovieManagementPage />} />
                    <Route path="/admin/schedule" element={<SchedulePage />} />
                    <Route path="/admin/tickets" element={<TicketTypesPage />} />
                    <Route path="/hall/book/:showtimeId" element={<HallBookingPage />} />
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/movies/:movieId/cinemas" element={<MovieCinemasPage />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route
                        path="/admin/users"
                        element={isAdmin ? <AdminUserManagement /> : <Navigate to="/dashboard" replace />}
                    />

                    <Route
                        path="/cashier"
                        element={isCashier || isAdmin ? <CashierCabinet /> : <Navigate to="/dashboard" replace />}
                    />

                    <Route
                        path="/controller" 
                        element={auth.user?.role === 'ROLE_CONTROLLER' || isCashier || isAdmin ? <ControllerCabinet /> : <Navigate to="/dashboard" replace />}
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="h-screen bg-slate-950 flex items-center justify-center">
                    <div className="text-2xl font-black text-white uppercase italic animate-pulse">
                        Loading Language...
                    </div>
                </div>
            }>
            <AppContent />
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
