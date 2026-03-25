import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLazyConfirmRegistrationQuery } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {CheckCircle, XCircle} from "lucide-react";


const ConfirmPage = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
                message: 'Account confirmed successfully! You can now log in.',
                type: 'success'
            }));
            setTimeout(() => navigate('/login'), 3000);
        }

        if (error) {
            const fetchError = error as { data?: { message?: string } };
            dispatch(showNotification({
                message: fetchError.data?.message || 'Confirmation failed. Link might be expired.',
                type: 'error'
            }));
        }
    }, [isSuccess, error, data, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-800">Verifying...</h2>
                    </div>
                ) : isSuccess ? (
                    <div className="w-10 h-10 rounded-full bg-cyan-200/30 backdrop-blur flex items-center justify-center shadow-inner">
                        <CheckCircle className="text-blue-500 w-12 h-12" />
                        <h2 className="text-2xl font-bold text-slate-800">Success!</h2>
                        <p className="text-slate-600">Redirecting to login...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <XCircle className="text-red-500 w-12 h-12" />
                        <h2 className="text-2xl font-bold text-slate-800">Error</h2>
                        <p className="text-slate-600 text-sm">
                            {((error as FetchBaseQueryError)?.data as { message?: string })?.message || 'Invalid link'}
                        </p>
                        <Link to="/register" className="inline-block mt-4 text-indigo-600 font-semibold hover:underline">
                            Back to Registration
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmPage;
