import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './features/auth/slice/authSlice';

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

/**
 * Component to handle OAuth2 redirect.
 * Now it also updates the Redux state so the app knows we are logged in.
 */
const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        if (accessToken) {
            // Update Redux + LocalStorage
            dispatch(setCredentials({ accessToken }));
            navigate('/dashboard');
        } else {
            navigate('/login?error=oauth_failed');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="text-xl font-medium text-indigo-600 animate-pulse">
                Completing authentication...
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <div
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/theater.jpg')"
                }}            >
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
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}
export default App;
