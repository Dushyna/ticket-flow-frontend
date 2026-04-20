import React from 'react';
import {type RootState} from '../app/store';
import {hideNotification} from '../features/notifications/slice/notificationSlice';
import {CheckCircle, Info, XCircle, X} from "lucide-react";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {useTranslation} from 'react-i18next';

const NotificationModal = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {isOpen, message, type} = useAppSelector((state: RootState) => state.notification);

    if (!isOpen) return null;

    interface StyleConfig {
        border: string;
        icon: React.ReactElement;
        glow: string;
        title: string;
        label: string;
    }

    const styles: Record<'success' | 'error' | 'info', StyleConfig> = {
        success: {
            border: 'border-green-500',
            glow: 'shadow-green-500/20',
            title: 'text-green-400',
            label: t('common.success'),
            icon: <CheckCircle className="text-green-500 w-8 h-8"/>
        },
        error: {
            border: 'border-red-500',
            glow: 'shadow-red-500/20',
            title: 'text-red-400',
            label: t('common.error'),
            icon: <XCircle className="text-red-500 w-8 h-8"/>
        },
        info: {
            border: 'border-indigo-500',
            glow: 'shadow-indigo-500/20',
            title: 'text-indigo-400',
            label: t('common.info'),
            icon: <Info className="text-indigo-500 w-8 h-8"/>
        }
    };

    const currentStyle = styles[type as keyof typeof styles] || styles.info;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className={`max-w-sm w-full bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl ${currentStyle.glow} overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300`}
            >
                <div
                    className={`h-1.5 w-full bg-gradient-to-r from-transparent via-${currentStyle.border.split('-')[1]}-500 to-transparent`}/>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5`}>
                            {currentStyle.icon}
                        </div>

                        <div>
                            <h3 className={`text-2xl font-black uppercase italic tracking-tight ${currentStyle.title}`}>
                                {currentStyle.label}
                            </h3>
                            <p className="mt-2 text-slate-400 font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => dispatch(hideNotification())}
                        className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {t('common.dismiss')}
                    </button>
                </div>

                <button
                    onClick={() => dispatch(hideNotification())}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20}/>
                </button>
            </div>
        </div>
    );
};

export default NotificationModal;
