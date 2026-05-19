import { useState, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useVerifyTicketEntranceMutation } from '../../features/booking/services/bookingApi';
import { type TicketVerificationResponse} from '../../features/booking/utils/utils.ts';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../../features/notifications/slice/notificationSlice';
import { ShieldCheck, ShieldAlert, Loader2, QrCode } from 'lucide-react';

export const ControllerCabinet = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [ticketId, setTicketId] = useState('');
    const [scanResult, setScanResult] = useState<TicketVerificationResponse | null>(null);

    const [verifyTicket, { isLoading }] = useVerifyTicketEntranceMutation();

    const handleScanSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const cleanId = ticketId.trim();
        if (!cleanId) return;

        try {
            const res = await verifyTicket(cleanId).unwrap();
            setScanResult(res);
            setTicketId('');
        } catch (err) {
            console.error("Gate access check-in verification failed:", err);
            setScanResult({
                valid: false,
                message: "TICKET_NOT_FOUND",
                movieTitle: null,
                seatInfo: null,
                startTime: null
            });

            // Trigger stylized Redux error modal using i18n key translation logic
            dispatch(showNotification({
                message: t('gate.TICKET_NOT_FOUND'),
                type: 'error'
            }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 w-full text-center">
            <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl">

                {/* ICON & TITLE BLOCK */}
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-indigo-500/20">
                    <QrCode size={32} className="text-indigo-400" />
                </div>

                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                    {t('gate.cabinet_title')}
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                    {t('gate.cabinet_subtitle')}
                </p>

                {/* FORM INPUT BAR */}
                <form onSubmit={handleScanSubmit} className="flex flex-col gap-4 mb-8">
                    <input
                        type="text"
                        value={ticketId}
                        autoFocus
                        onChange={(e) => setTicketId(e.target.value)}
                        placeholder={t('gate.input_placeholder')}
                        className="w-full bg-black/20 border border-white/10 px-5 py-4 rounded-2xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-center"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !ticketId.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black uppercase italic text-sm rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            t('gate.submit_btn')
                        )}
                    </button>
                </form>

                {/* DISPLAY MONITOR: VERIFICATION SCAN RESULT */}
                {scanResult && (
                    <div className={`w-full p-6 rounded-3xl border transition-all animate-in fade-in duration-300 ${
                        scanResult.valid
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                        <div className="flex flex-col items-center gap-3">
                            {scanResult.valid ? (
                                <ShieldCheck size={48} className="text-emerald-500 animate-bounce" />
                            ) : (
                                <ShieldAlert size={48} className="text-red-500 animate-pulse" />
                            )}

                            <h2 className="text-lg font-black uppercase tracking-tight italic leading-tight">
                                {t(`gate.${scanResult.message}`)}
                            </h2>

                            {scanResult.movieTitle && (
                                <div className="mt-4 text-left w-full bg-black/30 p-4 rounded-xl border border-white/5 font-medium text-slate-300">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                        {t('gate.data_header')}
                                    </div>
                                    <div className="text-base font-black text-white uppercase italic leading-tight">
                                        {scanResult.movieTitle}
                                    </div>
                                    <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-2">
                                        {scanResult.seatInfo}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-semibold mt-1">
                                        {new Date(scanResult.startTime!).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
