import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { hideNotification } from '../features/notifications/slice/notificationSlice';
import {CheckCircle, Info, XCircle} from "lucide-react";

/**
 * Global Notification Modal
 * Listens to the notification slice and shows success/error/info messages.
 */
const NotificationModal = () => {
    const dispatch = useDispatch();
    const { isOpen, message, type } = useSelector((state: RootState) => state.notification);

    if (!isOpen) return null;

    const styles = {
        success: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: <CheckCircle className="text-blue-500 w-12 h-12" />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800',
            icon: <XCircle className="text-red-500 w-12 h-12" />
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800',
            icon: <Info className="text-blue-500 w-12 h-12" />
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div
                className={`max-w-sm w-full bg-white rounded-2xl shadow-2xl border-t-4 ${currentStyle.border} overflow-hidden transform transition-all scale-100`}
            >
                <div className={`p-6 ${currentStyle.bg}`}>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl">{currentStyle.icon}</span>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 capitalize">
                                {type}
                            </h3>
                            <p className={`mt-1 text-sm font-medium ${currentStyle.text}`}>
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white px-6 py-4 flex justify-end">
                    <button
                        onClick={() => dispatch(hideNotification())}
                        className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
