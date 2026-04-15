import {useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useGetHallByIdQuery} from '../../features/cinema/services/cinemaApi';
import {useGetTicketTypesByOrgQuery, useGetShowtimeByIdQuery}
    from '../../features/cinema/services/movieApi';
import {HallSvgGrid} from '../hall/HallSvgGrid';
import HallScreen from '../hall/HallScreen';
import {useDispatch} from "react-redux";
import {showNotification} from "../../features/notifications/slice/notificationSlice.ts";
import {useCreateBookingMutation, useGetOccupiedSeatsQuery} from "../../features/booking/services/bookingApi.ts";

const HallBookingPage = () => {
    const {showtimeId} = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const {
        data: showtime,
        isLoading: isShowtimeLoading
    } = useGetShowtimeByIdQuery(showtimeId || '', {skip: !showtimeId});
    const {
        data: hall,
        isLoading: isHallLoading
    } = useGetHallByIdQuery(showtime?.hallId || '', {skip: !showtime?.hallId});
    const {
        data: occupiedSeats,
        isLoading: isOccupiedLoading
    } = useGetOccupiedSeatsQuery(showtimeId || '', {skip: !showtimeId});

    const {data: ticketTypes} = useGetTicketTypesByOrgQuery(hall?.organizationId || '', {skip: !hall?.organizationId});

    const [createBooking, {isLoading: isBookingProcessing}] = useCreateBookingMutation();

    const [selectedSeats, setSelectedSeats] = useState<{ r: number; c: number; typeId?: string }[]>([]);
    const defaultTicketType = useMemo(() => ticketTypes?.find(t => t.isDefault) || ticketTypes?.[0], [ticketTypes]);

    const handleSeatClick = (r: number, c: number) => {
        if (hall?.layoutConfig.grid[r][c] === 'aisle') return;

        const isOccupied = occupiedSeats?.some(s => s.row === r && s.col === c);
        if (isOccupied) {
            dispatch(showNotification({message: "This seat is already taken!", type: "error"}));
            return;
        }

        const isAlreadySelected = selectedSeats.some(s => s.r === r && s.c === c);
        if (isAlreadySelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.r === r && s.c === c)));
        } else {
            if (selectedSeats.length < 6) {
                setSelectedSeats([...selectedSeats, {r, c, typeId: defaultTicketType?.id}]);
            }
        }
    };

    const totalPrice = useMemo(() => {
        if (!hall || !showtime) return 0;

        return selectedSeats.reduce((sum, seat) => {
            const zoneId = hall.layoutConfig.grid[seat.r]?.[seat.c];
            const zone = hall.layoutConfig.zoneConfigs.find(z => z.id === zoneId);

            const zoneMultiplier = (zone as { multiplier?: number })?.multiplier || 1.0;

            const ticketType = ticketTypes?.find(t => t.id === seat.typeId) || defaultTicketType;
            const ticketDiscount = ticketType?.discount || 1.0;

            return sum + ((showtime.basePrice || 0) * zoneMultiplier * ticketDiscount);
        }, 0);
    }, [selectedSeats, ticketTypes, showtime, hall, defaultTicketType]);

    const handleConfirmBooking = async () => {
        if (!showtimeId || selectedSeats.length === 0) return;

        try {
            const payload = {
                showtimeId: showtimeId,
                seats: selectedSeats.map(s => ({
                    row: s.r,
                    col: s.c,
                    ticketTypeId: s.typeId || defaultTicketType?.id
                }))
            };

            await createBooking(payload).unwrap();
            dispatch(showNotification({message: "Success! Seats booked.", type: "success"}));
            navigate('/dashboard');
        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({message: errorData.data?.message || "Booking failed", type: "error"}));
        }
    };

    if (isHallLoading || isOccupiedLoading || isShowtimeLoading)
        return <div className="p-20 text-white animate-pulse uppercase font-black text-center">Loading Hall &
            Showtime...</div>;

    if (!hall || !showtime) return <div className="p-20 text-white text-center">Data not found</div>;

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
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        {showtime.movieTitle}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                        {hall.name} • {new Date(showtime.startTime).toLocaleString()}
                    </p></div>

                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Tickets</span>
                        <span className="text-xl font-black text-white">{selectedSeats.length}</span>
                    </div>
                    <div
                        className="px-6 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center min-w-[120px]">
                        <span className="block text-[9px] font-black text-indigo-400 uppercase mb-1">Total Amount</span>
                        <span className="text-xl font-black text-white italic">
            ${totalPrice.toFixed(2)}
        </span>
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

            {/* Selected Seats Details & Ticket Types */}
            {hall && selectedSeats.length > 0 && (
                <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSeats.map((seat, index) => {
                        const zoneId = hall.layoutConfig.grid[seat.r][seat.c];
                        const zone = hall.layoutConfig.zoneConfigs.find(z => z.id === zoneId);

                        return (
                            <div key={`${seat.r}-${seat.c}`} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase">
                            Row {seat.r + 1}, Seat {seat.c + 1}
                        </span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                            Zone: {zone?.label || 'Standard'} {zone?.multiplier !== 1 && `(x${zone?.multiplier})`}
                        </span>
                                </div>

                                <select
                                    value={seat.typeId}
                                    onChange={(e) => {
                                        const newSeats = [...selectedSeats];
                                        newSeats[index] = { ...seat, typeId: e.target.value };
                                        setSelectedSeats(newSeats);
                                    }}
                                    className="bg-slate-900 text-white text-[10px] font-black uppercase p-2 rounded-xl border border-white/10 outline-none focus:border-indigo-500"
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

            <div
                className="w-full max-w-5xl bg-white/5 p-12 rounded-[60px] border border-white/10 relative overflow-hidden">
                <HallScreen/>

                <div className="mt-20">
                    <HallSvgGrid
                        grid={hall.layoutConfig.grid}
                        configs={hall.layoutConfig.zoneConfigs}
                        onSeatClick={handleSeatClick}
                        onRowClick={() => {
                        }}
                        onColumnClick={() => {
                        }}
                        isZoomedOut={false}
                        svgRef={{current: null}}
                        selectedSeats={selectedSeats}
                        occupiedSeats={occupiedSeats}
                    />
                </div>

                <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800"/>
                        <span className="text-[10px] font-black text-slate-500 uppercase">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#fbbf24]"/>
                        <span className="text-[10px] font-black text-[#fbbf24] uppercase">Your Choice</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-900/50"/>
                        <span className="text-[10px] font-black text-slate-700 uppercase">Occupied</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallBookingPage;
