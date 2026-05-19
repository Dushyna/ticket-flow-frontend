import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {XCircle, X} from 'lucide-react';

const PaymentCancel = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
            <button
                onClick={() => navigate('/dashboard')}
                className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
            >
                <X size={32}/>
            </button>

            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle size={48} className="text-red-500"/>
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic mb-4">
                {t('payment.cancel_title', 'Payment Cancelled')}
            </h1>
            <p className="text-slate-400 max-w-md mb-10 font-medium">
                {t('payment.cancel_message', 'Don\'t worry, your seats are still held for a short time. You can try again from your dashboard.')}
            </p>
            <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase italic rounded-2xl transition-all"
            >
                {t('common.try_again', 'Try Again')}
            </button>
        </div>
    );
};

export default PaymentCancel;
