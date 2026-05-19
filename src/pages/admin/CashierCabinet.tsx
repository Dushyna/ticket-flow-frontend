import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCinemasQuery, useGetHallByIdQuery } from '../../features/cinema/services/cinemaApi';
import {
    useGetShowtimesByCinemaQuery,
    useGetTicketTypesByOrgQuery
} from '../../features/cinema/services/movieApi';
import {
    useSellAtBoxOfficeMutation,
    useGetOccupiedSeatsQuery,
    useGetCashierHistoryQuery
} from '../../features/booking/services/bookingApi';
import { HallSvgGrid } from '../hall/HallSvgGrid.tsx';
import { formatTime, formatDateLabel } from '../../features/cinema/utils/dateTimeUtils.ts';
import { Loader2, Armchair, Ticket, Printer, History } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../../features/notifications/slice/notificationSlice';
import { calculateSeatPrice, checkSeatAvailability, toggleSeatInCart } from "../../features/cinema/utils/utils.ts";

export const CashierCabinet = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    // 1. Core State Selectors
    const [selectedCinemaId, setSelectedCinemaId] = useState<string>('');
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('');
    const [selectedSeats, setSelectedSeats] = useState<{ r: number; c: number; typeId?: string }[]>([]);

    // Track the last successfully generated Order UUID node for unified printing
    const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string>('');

    // 2. API Queries
    const { data: cinemas, isLoading: loadingCinemas } = useGetCinemasQuery();
    const { data: showtimes, isLoading: loadingShowtimes } = useGetShowtimesByCinemaQuery(selectedCinemaId, {
        skip: !selectedCinemaId,
    });

    // Find metadata for the currently active showtime selection
    const activeShowtime = showtimes?.find(s => s.id === selectedShowtimeId);

    const { data: hall, isLoading: loadingHall } = useGetHallByIdQuery(activeShowtime?.hallId || '', {
        skip: !activeShowtime?.hallId,
    });
    const { data: occupiedSeats } = useGetOccupiedSeatsQuery(selectedShowtimeId, {
        skip: !selectedShowtimeId,
        pollingInterval: 5000,
        refetchOnMountOrArgChange: true,
    });
    const { data: ticketTypes } = useGetTicketTypesByOrgQuery(hall?.organizationId || '', {
        skip: !hall?.organizationId,
    });

    // Fetch background live data log queries for historical staff audits
    const { data: historyLogs, refetch: refetchHistory } = useGetCashierHistoryQuery();

    const defaultTicketType = useMemo(() => ticketTypes?.find(tt => tt.isDefault) || ticketTypes?.[0], [ticketTypes]);

    // 3. Mutations
    const [sellAtBoxOffice, { isLoading: isSelling }] = useSellAtBoxOfficeMutation();

    const handleSeatSelection = (r: number, c: number) => {
        const seatStatus = checkSeatAvailability(r, c, hall?.layoutConfig.grid || [], occupiedSeats);

        if (seatStatus === 'aisle') return;
        if (seatStatus === 'taken') {
            dispatch(showNotification({ message: t('booking.error_taken'), type: "error" }));
            return;
        }

        const { updatedSeats } = toggleSeatInCart(selectedSeats, r, c, defaultTicketType?.id);
        setSelectedSeats(updatedSeats);
    };

    // Calculate dynamic total price using zone multipliers and ticket type discounts from utils
    const totalPrice = useMemo(() => {
        if (!hall || !activeShowtime) return 0;

        return selectedSeats.reduce((sum, seat) => {
            return sum + calculateSeatPrice(
                seat,
                activeShowtime.basePrice,
                hall.layoutConfig.grid,
                hall.layoutConfig.zoneConfigs,
                ticketTypes || [],
                defaultTicketType
            );
        }, 0);
    }, [selectedSeats, ticketTypes, activeShowtime, hall, defaultTicketType]);

    const handleCashPurchase = async () => {
        if (selectedSeats.length === 0 || !selectedShowtimeId) return;

        const payload = {
            showtimeId: selectedShowtimeId,
            seats: selectedSeats.map(s => ({
                row: s.r,
                col: s.c,
                ticketTypeId: s.typeId || defaultTicketType?.id
            }))
        };

        try {
            const result = await sellAtBoxOffice(payload).unwrap();
            dispatch(showNotification({
                message: t('cashier.sale_success', 'Success! Physical ticket printed.'),
                type: 'success'
            }));

            if (result && result.orderId) {
                setLastCreatedOrderId(result.orderId);
            }

            setSelectedSeats([]);
            refetchHistory(); // Instantly update historical data log table matrices
        } catch (err) {
            console.error("Box office cash transaction failed:", err);
            dispatch(showNotification({
                message: t('cashier.sale_error', 'Error: Transaction could not be completed.'),
                type: 'error'
            }));
        }
    };

    // Safe inline secure PDF multi-page compilation launcher executing via local Blob map channels
    const triggerPdfDownload = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/tickets/download/order/${orderId}`, {
                credentials: 'include' // Enforces precise session authorization cookie binding passes
            });

            if (!response.ok) {
                dispatch(showNotification({
                    message: t('cashier.sale_error', 'Failed to generate PDF document payload stream.'),
                    type: 'error'
                }));
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

    if (loadingCinemas) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin mb-2 text-indigo-500" size={32} />
                <p className="uppercase tracking-widest text-xs font-black text-slate-400">
                    {t('cashier.loading_cinemas')}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-10 flex flex-col items-center w-full">
            <h1 className="text-4xl font-black text-white uppercase italic mb-10 tracking-tighter">
                {t('cashier.workspace_title')}
            </h1>

            {/* CONTROL PANEL: SELECTORS */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-white/5 p-6 rounded-[30px] border border-white/10">
                {/* Cinema Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                        {t('cashier.lbl_select_cinema')}
                    </label>
                    <select
                        value={selectedCinemaId}
                        onChange={(e) => {
                            setSelectedCinemaId(e.target.value);
                            setSelectedShowtimeId('');
                            setSelectedSeats([]);
                        }}
                        className="bg-slate-900 border border-white/10 p-3.5 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer text-sm"
                    >
                        <option value="">{t('cashier.opt_choose_cinema')}</option>
                        {cinemas?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Showtime Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                        {t('cashier.lbl_select_showtime')}
                    </label>
                    <select
                        value={selectedShowtimeId}
                        disabled={!selectedCinemaId || loadingShowtimes}
                        onChange={(e) => {
                            setSelectedShowtimeId(e.target.value);
                            setSelectedSeats([]);
                        }}
                        className="bg-slate-900 border border-white/10 p-3.5 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500 disabled:opacity-30 cursor-pointer text-sm"
                    >
                        <option value="">
                            {loadingShowtimes ? t('cashier.opt_loading_sessions') : t('cashier.opt_choose_showtime')}
                        </option>
                        {showtimes?.map(s => (
                            <option value={s.id} key={s.id}>
                                {s.movieTitle} | {formatDateLabel(s.startTime)} @ {formatTime(s.startTime)} ({s.hallName})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* SEAT GRID DISPATCHER */}
            {selectedShowtimeId && hall && occupiedSeats ? (
                <div className="flex flex-col items-center gap-8 w-full max-w-5xl">

                    {/* INDIVIDUAL TICKET TYPE CARDS SELECTION */}
                    {selectedSeats.length > 0 && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {selectedSeats.map((seat, index) => {
                                const zoneId = hall.layoutConfig.grid[seat.r][seat.c];
                                const zone = hall.layoutConfig.zoneConfigs.find(z => z.id === zoneId);

                                return (
                                    <div key={`${seat.r}-${seat.c}`} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in duration-200">
                                        <div className="flex items-center gap-3">
                                            <Armchair size={16} className="text-indigo-400 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase">
                                                    {t('booking.row')} {seat.r + 1}, {t('booking.seat')} {seat.c + 1}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                                                    {t('booking.zone')}: {zone?.label || t('booking.zone_standard')} {zone?.multiplier !== 1 && `(x${zone?.multiplier})`}
                                                </span>
                                            </div>
                                        </div>

                                        <select
                                            value={seat.typeId}
                                            onChange={(e) => {
                                                const newSeats = [...selectedSeats];
                                                newSeats[index] = { ...seat, typeId: e.target.value };
                                                setSelectedSeats(newSeats);
                                            }}
                                            className="bg-slate-900 text-white text-[10px] font-black uppercase p-2.5 rounded-xl border border-white/10 outline-none focus:border-indigo-500 cursor-pointer"
                                        >
                                            {ticketTypes?.map(tt => (
                                                <option key={tt.id} value={tt.id}>
                                                    {tt.label} (x{tt.discount})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* HALL VIEW CONTAINER */}
                    <div className="w-full bg-white/5 p-12 rounded-[60px] border border-white/10 relative overflow-hidden flex flex-col items-center">
                        <div className="w-full max-w-2xl bg-indigo-500/20 h-2 rounded-full blur-sm mb-2" />
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-10">
                            {t('cashier.screen_area')}
                        </p>

                        <HallSvgGrid
                            grid={hall.layoutConfig.grid}
                            configs={hall.layoutConfig.zoneConfigs}
                            onSeatClick={handleSeatSelection}
                            onRowClick={() => {}}
                            onColumnClick={() => {}}
                            isZoomedOut={false}
                            svgRef={{ current: null }}
                            selectedSeats={selectedSeats}
                            occupiedSeats={occupiedSeats}
                        />

                        {/* LEGEND LAYOUT */}
                        <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-white/5 w-full">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-800"/>
                                <span className="text-[10px] font-black text-slate-500 uppercase">{t('booking.legend_available')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#fbbf24]"/>
                                <span className="text-[10px] font-black text-[#fbbf24] uppercase">{t('booking.legend_selected')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-900/50"/>
                                <span className="text-[10px] font-black text-slate-700 uppercase">{t('booking.legend_occupied')}</span>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SUMMARY FOOTER PANEL */}
                    <div className="w-full bg-white/5 p-6 rounded-[30px] border border-white/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-left">
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block">{t('booking.tickets_count')}</span>
                            <span className="text-2xl font-black text-white italic mt-1 block">
                                {selectedSeats.length} {t('cashier.cart_selected_seats')}
                            </span>
                        </div>

                        {/* --- UNIFIED SINGLE PRINT ORDER PDF BUTTON --- */}
                        {lastCreatedOrderId && (
                            <button
                                onClick={() => triggerPdfDownload(lastCreatedOrderId)}
                                className="flex-1 max-w-xs py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 animate-pulse text-xs tracking-wider"
                            >
                                <Printer size={16} />
                                {t('cashier.btn_print_order')}
                            </button>
                        )}

                        <div className="text-center sm:text-right flex flex-col sm:flex-row items-center gap-6">
                            <div>
                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block">{t('booking.total_amount')}</span>
                                <span className="text-2xl font-black text-white mt-1 block italic">
                                    €{totalPrice.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={handleCashPurchase}
                                disabled={selectedSeats.length === 0 || isSelling}
                                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black uppercase italic rounded-2xl transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 text-sm"
                            >
                                {isSelling ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <Ticket size={16} />
                                        {t('cashier.btn_print_tickets', { count: selectedSeats.length })}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : selectedShowtimeId && (loadingHall || !hall || !occupiedSeats) ? (
                <div className="text-white flex items-center gap-2 p-10 font-bold uppercase tracking-widest text-xs">
                    <Loader2 className="animate-spin text-indigo-500" size={20} />
                    {t('cashier.loading_hall_map')}
                </div>
            ) : (
                <div className="text-slate-500 font-bold uppercase tracking-widest p-20 border border-dashed border-white/5 w-full max-w-5xl text-center rounded-[40px] text-xs leading-relaxed">
                    {t('cashier.fallback_hint')}
                </div>
            )}

            {/* --- NEW SECTION: HISTORICAL RE-PRINT MONITOR LAYER --- */}
            <div className="w-full max-w-5xl mt-16 bg-white/5 border border-white/10 rounded-[30px] p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <History size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tight">
                        {t('cashier.history_title')}
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                        <tr className="border-b border-white/10 text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                            <th className="p-4">{t('cashier.th_time')}</th>
                            <th className="p-4">{t('cashier.th_movie')}</th>
                            <th className="p-4 text-center">{t('cashier.th_qty')}</th>
                            <th className="p-4 text-right">{t('cashier.th_total')}</th>
                            <th className="p-4 text-right">{t('cashier.th_action')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold text-slate-300">
                        {historyLogs?.map((log) => (
                            <tr key={log.orderId} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 font-mono text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                                <td className="p-4 text-white italic">{log.movieTitle} <span className="text-[10px] text-slate-500 block font-normal mt-0.5">{log.hallName}</span></td>
                                <td className="p-4 text-center text-indigo-400 font-black">{log.ticketsCount}</td>
                                <td className="p-4 text-right text-emerald-400">€{log.totalPrice.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => triggerPdfDownload(log.orderId)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-black uppercase text-[9px] tracking-wider transition-all flex items-center gap-1.5 ml-auto active:scale-95"
                                    >
                                        <Printer size={12} />
                                        {t('cashier.btn_reprint')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};
