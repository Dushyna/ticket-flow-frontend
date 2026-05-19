import { useGetMyBookingsQuery, useLazyGetPaymentUrlQuery } from '../features/booking/services/bookingApi';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import type { BookingResponseDto } from "../features/booking/utils/utils.ts";

const UserProfile = () => {
    const { t } = useTranslation();
    const { data: bookings, isLoading } = useGetMyBookingsQuery();
    const [getPaymentUrl] = useLazyGetPaymentUrlQuery();

    // --- FIXED: Added the correct index [0] to safely read the first booking element inside the array ---
    const isFirstInOrder = (currentBooking: BookingResponseDto, allBookings: BookingResponseDto[]) => {
        const orderBookings = allBookings.filter(b => b.orderId === currentBooking.orderId);
        return orderBookings.length > 0 && orderBookings[0].id === currentBooking.id;
    };

    const handlePayNow = async (orderId: string) => {
        try {
            const result = await getPaymentUrl(orderId).unwrap();
            window.location.assign(result.paymentUrl);
        } catch (err) {
            console.error("Failed to load payment page", err);
        }
    };

    const handleDownloadTickets = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/download/order/${orderId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                console.error("Failed to fetch tickets PDF from backend");
                return;
            }

            const blob = await response.blob();
            const fileURL = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const pdfWindow = window.open(fileURL, '_blank');
            if (pdfWindow) {
                pdfWindow.focus();
            }
        } catch (err) {
            console.error("PDF engine document rendering thread pipeline crashed:", err);
        }
    };

    if (isLoading) return <div className="p-20 text-white text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-950 p-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white uppercase italic mb-10 tracking-tighter">
                    {t('profile.my_tickets', 'My Tickets')}
                </h1>

                <div className="grid gap-4">
                    {bookings?.map((booking: BookingResponseDto) => (
                        <div key={booking.id} className="bg-white/5 border border-white/10 p-6 rounded-[30px] flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-500' :
                                        booking.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                                }`}>
                                    {booking.status === 'CONFIRMED' && <CheckCircle2 size={24} />}
                                    {booking.status === 'PENDING' && <Clock size={24} />}
                                    {booking.status === 'CANCELLED' && <AlertCircle size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase italic">{booking.movieTitle}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        {booking.hallName} • {new Date(booking.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-indigo-400 font-black uppercase mt-1">
                                        Row {booking.seat.row + 1}, Seat {booking.seat.col + 1}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                                        booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                        {booking.status}
                                    </span>
                                    <p className="text-xl font-black text-white mt-1 italic">€{booking.price}</p>
                                </div>

                                {booking.status === 'PENDING' && isFirstInOrder(booking, bookings || []) && (
                                    <button
                                        onClick={() => handlePayNow(booking.orderId)}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic text-[11px] rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        {t('payment.pay_now', 'Pay Now')}
                                    </button>
                                )}

                                {booking.status === 'CONFIRMED' && isFirstInOrder(booking, bookings || []) && (
                                    <button
                                        onClick={() => handleDownloadTickets(booking.orderId)}
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase italic text-[11px] rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                    >
                                        <Printer size={14} />
                                        {t('profile.btn_print_tickets', 'Print Tickets')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {bookings?.length === 0 && (
                        <div className="text-center p-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                            <p className="text-slate-500 font-bold uppercase tracking-widest">No tickets found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
