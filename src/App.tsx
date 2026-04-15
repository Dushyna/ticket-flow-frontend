import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from './features/auth/services/authApi';
import { setCredentials, logOut } from './features/auth/slice/authSlice';

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

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: user, isSuccess, isError } = useGetCurrentUserQuery();

    useEffect(() => {
        if (isSuccess && user) {
            dispatch(setCredentials(user));
            navigate('/dashboard');
        } else if (isError) {
            navigate('/login?error=oauth_failed');
        }
    }, [user, isSuccess, isError, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
            <div className="text-xl font-black text-indigo-500 animate-pulse uppercase italic">
                Syncing with Google...
            </div>
        </div>
    );
};

const AppContent = () => {
    const dispatch = useDispatch();
    const { data: user, isSuccess, isError, isLoading } = useGetCurrentUserQuery();

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

                </Routes>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
