import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetHallByIdQuery } from '../../features/cinema/services/cinemaApi';
import { HallSvgGrid } from '../hall/HallSvgGrid';
import HallScreen from '../hall/HallScreen';
import {useDispatch} from "react-redux";
import {showNotification} from "../../features/notifications/slice/notificationSlice.ts";
import {useCreateBookingMutation, useGetOccupiedSeatsQuery} from "../../features/booking/services/bookingApi.ts";

const HallBookingPage = () => {
    const { hallId } = useParams<{ hallId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: hall, isLoading: isHallLoading } = useGetHallByIdQuery(hallId || '', { skip: !hallId });
    const { data: occupiedSeats, isLoading: isOccupiedLoading } = useGetOccupiedSeatsQuery(hallId || '', { skip: !hallId });

    const [createBooking, { isLoading: isBookingProcessing }] = useCreateBookingMutation();

    const [selectedSeats, setSelectedSeats] = useState<{ r: number; c: number }[]>([]);

    const handleSeatClick = (r: number, c: number) => {
        if (hall?.layoutConfig.grid[r][c] === 'aisle') return;

        const isOccupied = occupiedSeats?.some(s => s.row === r && s.col === c);
        if (isOccupied) {
            dispatch(showNotification({ message: "This seat is already taken!", type: "error" }));
            return;
        }

        const isAlreadySelected = selectedSeats.some(s => s.r === r && s.c === c);
        if (isAlreadySelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.r === r && s.c === c)));
        } else {
            if (selectedSeats.length < 6) {
                setSelectedSeats([...selectedSeats, { r, c }]);
            }
        }
    };
    const handleConfirmBooking = async () => {
        if (!hallId || selectedSeats.length === 0) return;

        try {
            const payload = {
                hallId: hallId,
                seats: selectedSeats.map(s => ({ row: s.r, col: s.c }))
            };

            await createBooking(payload).unwrap();

            dispatch(showNotification({ message: "Success! Seats booked.", type: "success" }));
            navigate('/dashboard');
        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({ message: errorData.data?.message || "Booking failed", type: "error" }));
        }
    };

    if (isHallLoading || isOccupiedLoading) return <div className="p-20 text-white animate-pulse uppercase font-black text-center">Loading Hall...</div>;
    if (!hall) return <div className="p-20 text-white text-center">Hall not found</div>;

    return (
        <div className="min-h-screen bg-slate-950 p-10 flex flex-col items-center">
            <div className="w-full max-w-6xl flex justify-between items-center mb-12">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2 hover:text-white transition-colors"
                    >
                        ← Back to Cinema
                    </button>
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        Choose <span className="text-indigo-500">Seats</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                        {hall.name} • IMAX Experience
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Tickets</span>
                        <span className="text-xl font-black text-white">{selectedSeats.length}</span>
                    </div>
                    <button
                        onClick={handleConfirmBooking}
                        disabled={selectedSeats.length === 0 || isBookingProcessing}
                        className="px-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl font-black uppercase italic text-white transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isBookingProcessing ? 'Processing...' : 'Book Now'}
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl bg-white/5 p-12 rounded-[60px] border border-white/10 relative overflow-hidden">
                <HallScreen />

                <div className="mt-20">
                    <HallSvgGrid
                        grid={hall.layoutConfig.grid}
                        configs={hall.layoutConfig.zoneConfigs}
                        onSeatClick={handleSeatClick}
                        onRowClick={() => {}}
                        onColumnClick={() => {}}
                        isZoomedOut={false}
                        svgRef={{ current: null }}
                        selectedSeats={selectedSeats}
                        occupiedSeats={occupiedSeats}
                    />
                </div>

                <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                        <span className="text-[10px] font-black text-[#fbbf24] uppercase">Your Choice</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-900/50" />
                        <span className="text-[10px] font-black text-slate-700 uppercase">Occupied</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallBookingPage;
