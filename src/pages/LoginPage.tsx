import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/services/authApi';
import { setCredentials } from '../features/auth/slice/authSlice';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { loginSchema } from '../features/auth/utils/validationSchemas';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as Yup from 'yup';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';

interface LoginValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const loginFields: FieldConfig[] = [
        { name: 'email', label: t('login.email_placeholder'), type: 'email', placeholder: 'your@email.com' },
        { name: 'password', label: t('login.pass_placeholder'), type: 'password', placeholder: '••••••••' }
    ];

    const handleLoginSubmit = async (values: LoginValues) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials(userData));
            dispatch(showNotification({
                message: t('login.success_msg'),
                type: 'success'
            }));
            navigate('/dashboard');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || t('login.error_invalid');

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
                    title={t('login.title')}
                    description={t('login.subtitle')}
                    fields={loginFields}
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema as Yup.AnyObjectSchema}
                    onSubmit={handleLoginSubmit}
                    onClose={() => navigate('/')}
                    submitText={t('login.title')}
                    isLoading={isLoading}
                />

                <div className="mt-6">
                    <div className="relative flex justify-center text-sm mb-6">
                        <span className="px-4 bg-slate-900/50 backdrop-blur-sm text-slate-400 uppercase tracking-widest text-[10px] font-bold z-10">
                            {t('login.or_continue')}
                        </span>
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                    </div>

                    <a
                        href="http://localhost:8080/oauth2/authorization/google"
                        className="w-full flex items-center justify-center py-4 px-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-600/20 transition-all mb-8 shadow-lg shadow-indigo-500/10"
                    >
                        <FcGoogle className="text-xl mr-3" />
                        {t('login.google_btn')}
                    </a>

                    <p className="text-center text-slate-500 text-sm font-medium">
                        {t('login.no_account')}{' '}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                            {t('login.register_link')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
