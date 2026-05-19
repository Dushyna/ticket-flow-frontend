import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useGetOrderStatusQuery } from "../../features/booking/services/bookingApi.ts";

const PaymentSuccess = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // Fetch actual order status from backend
    const { data, isLoading, isError } = useGetOrderStatusQuery(sessionId || '', {
        skip: !sessionId,
        pollingInterval: 3000, // Optional: poll every 3s if webhook is slow
    });

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
                <XCircle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-black text-white uppercase italic mb-4">
                    {t('payment.error_verifying', 'Error verifying payment')}
                </h1>
                <button onClick={() => navigate('/dashboard')} className="text-indigo-400 uppercase text-xs font-bold underline">
                    {t('common.go_back', 'Go back')}
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-white">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="uppercase font-black italic tracking-widest">{t('payment.verifying', 'Verifying payment...')}</p>
            </div>
        );
    }

    const isCancelled = data?.status === 'CANCELLED';

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
            {isCancelled ? (
                // CASE: LATE PAYMENT / REFUNDED
                <>
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <XCircle size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase italic mb-4">
                        {t('payment.timeout_title', 'Session Expired')}
                    </h1>
                    <p className="text-slate-400 max-w-md mb-10 font-medium">
                        {t('payment.timeout_message', 'Payment arrived too late and seats were taken. A full refund has been issued to your card.')}
                    </p>
                </>
            ) : (
                // CASE: SUCCESS
                <>
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle size={48} className="text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase italic mb-4">
                        {t('payment.success_title', 'Success!')}
                    </h1>
                    <p className="text-slate-400 max-w-md mb-10 font-medium">
                        {t('payment.success_message', 'Your tickets have been sent to your email. See you at the cinema!')}
                    </p>
                </>
            )}

            <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic rounded-2xl transition-all"
            >
                {t('common.go_to_dashboard', 'Go to Dashboard')}
            </button>
        </div>
    );
};

export default PaymentSuccess;
