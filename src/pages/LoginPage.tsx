import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/services/authApi';
import { setCredentials } from '../features/auth/slice/authSlice';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { loginSchema } from '../features/auth/utils/validationSchemas';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as Yup from 'yup';

interface LoginValues {
    email: string;
    password: string;
}


const LoginPage = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFields: FieldConfig[] = [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }
    ];

    const handleLoginSubmit = async (values: LoginValues) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials(userData));

            dispatch(showNotification({
                message: 'Welcome back!',
                type: 'success'
            }));

            navigate('/dashboard');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || 'Invalid email or password';

            dispatch(showNotification({
                message: errorMessage,
                type: 'error'
            }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">
            <div className="w-full">
                <DynamicForm
                    title="Sign In"
                    description="Welcome back! Please enter your details."
                    fields={loginFields}
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema as Yup.AnyObjectSchema}
                    onSubmit={handleLoginSubmit}
                    onClose={() => navigate('/')}
                    submitText="Sign In"
                    isLoading={isLoading}
                />

                <div className="mt-6">
                    <div className="relative flex justify-center text-sm mb-6">
                        <span className="px-2 bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            Or continue with
                        </span>
                        <div className="absolute inset-0 flex items-center -z-10">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                    </div>

                    <a
                        href="http://localhost:8080/oauth2/authorization/google"
                        className="w-full flex items-center justify-center py-3 px-4 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all mb-8"
                    >
                        <img src="https://www.svgrepo.com" className="w-5 h-5 mr-3" alt="Google" />
                        Google Account
                    </a>

                    <p className="text-center text-slate-500 text-sm font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
