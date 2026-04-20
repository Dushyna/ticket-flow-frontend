import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLazyConfirmRegistrationQuery } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

const ConfirmPage = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const isProcessed = useRef(false);

    const [trigger, { data, error, isLoading, isSuccess }] = useLazyConfirmRegistrationQuery();

    useEffect(() => {
        if (code && !isProcessed.current) {
            isProcessed.current = true;
            trigger(code);
        }
    }, [code, trigger]);

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(showNotification({
                message: t('confirm.success_msg'),
                type: 'success'
            }));
            setTimeout(() => navigate('/login'), 3000);
        }

        if (error) {
            const fetchError = error as { data?: { message?: string } };
            dispatch(showNotification({
                message: fetchError.data?.message || t('confirm.error_generic'),
                type: 'error'
            }));
        }
    }, [isSuccess, error, data, dispatch, navigate, t]);

    return (
        <div className="max-w-md w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">
            {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                        {t('confirm.loading_title')}
                    </h2>
                </div>
            ) : isSuccess ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="text-emerald-400 w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                        {t('confirm.success_title')}
                    </h2>
                    <p className="text-slate-300 font-medium italic">
                        {t('confirm.redirect_msg')}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-red-500/20 rounded-full">
                        <XCircle className="text-red-400 w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                        {t('confirm.error_title')}
                    </h2>
                    <p className="text-slate-400 text-sm italic">
                        {((error as FetchBaseQueryError)?.data as { message?: string })?.message || t('confirm.error_generic')}
                    </p>
                    <Link
                        to="/register"
                        className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                        {t('confirm.back_to_register')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ConfirmPage;
