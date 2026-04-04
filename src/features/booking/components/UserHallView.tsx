import { useState } from 'react';
import { useGetHallByIdQuery } from '../../cinema/services/cinemaApi.ts';
import { HallSvgGrid } from '../../../pages/hall/HallSvgGrid';

const UserHallView = ({ hallId }: { hallId: string }) => {
    const { data: hall, isLoading } = useGetHallByIdQuery(hallId);

    const [selectedSeats, setSelectedSeats] = useState<{r: number, c: number}[]>([]);

    const handleSeatSelection = (r: number, c: number) => {
        const isSelected = selectedSeats.some(s => s.r === r && s.c === c);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.r === r && s.c === c)));
        } else {
            if (selectedSeats.length < 6) {
                setSelectedSeats([...selectedSeats, { r, c }]);
            }
        }
    };

    if (isLoading) return <div>Loading hall layout...</div>;
    if (!hall) return <div>Hall not found</div>;

    return (
        <div className="flex flex-col items-center gap-8 p-10 bg-slate-950 rounded-[40px]">
            <h2 className="text-3xl font-black text-white uppercase italic">{hall.name}</h2>

            {/* Screen */}
            <div className="w-full max-w-2xl bg-indigo-500/20 h-2 rounded-full blur-sm mb-10" />

            <HallSvgGrid
                grid={hall.layoutConfig.grid}
                configs={hall.layoutConfig.zoneConfigs}
                onSeatClick={handleSeatSelection}
                onRowClick={() => {}}
                onColumnClick={() => {}}
                isZoomedOut={false}
                svgRef={{ current: null }}
                // Тут ми пізніше додамо пропс для відображення обраних місць золотим кольором
            />

            {/* Cart */}
            <div className="w-full max-w-md bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xs font-black uppercase text-indigo-400 mb-4 tracking-widest">Selected Seats</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat, i) => (
                        <div key={i} className="px-3 py-1 bg-indigo-600 rounded-lg text-[10px] font-black text-white">
                            Row {seat.r + 1}, Seat {seat.c + 1}
                        </div>
                    ))}
                </div>
                <button
                    disabled={selectedSeats.length === 0}
                    className="w-full mt-6 py-4 bg-green-600 hover:bg-green-500 disabled:opacity-30 rounded-2xl font-black uppercase italic transition-all"
                >
                    Confirm Booking ({selectedSeats.length} tickets)
                </button>
            </div>
        </div>
    );
};
export default UserHallView;