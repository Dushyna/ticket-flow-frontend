import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../features/notifications/slice/notificationSlice.ts';
import HallLegend from "./HallLegend.tsx";
import ZonePicker from './ZonePicker';
import {type ZoneType, INITIAL_ZONES, type SizeInputProps, type ZoneConfig} from "./types.ts";
import HallScreen from "./HallScreen.tsx";
import ExportButton from "./ExportButton.tsx";
import { useCreateHallMutation } from '../../features/cinema/services/cinemaApi';
import CinemaSelect from "./CinemaSelect.tsx";
import {useNavigate} from "react-router-dom";

const CreateHallPage = () => {
    const dispatch = useDispatch();
    const [createHall, { isLoading: isSaving }] = useCreateHallMutation();
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(12);
    const [isZoomedOut, setIsZoomedOut] = useState(false);
    const [activeZone, setActiveZone] = useState<ZoneType>('parterre');
    const [configs, setConfigs] = useState<ZoneConfig[]>(INITIAL_ZONES);
    const [history, setHistory] = useState<ZoneType[][][]>([]);
    const [selectedCinemaId, setSelectedCinemaId] = useState<string>('');
    const [hallName, setHallName] = useState<string>('New Hall');

    const navigate = useNavigate();
    const svgRef = useRef<SVGSVGElement>(null);

    const addZone = () => {
        const newId = `z${Date.now()}`;

        const bluePalette = [
            '#1d4ed8', // (Blue 700)
            '#3b82f6', //  (Blue 500)
            '#60a5fa', //  (Blue 400)
            '#93c5fd', //  (Blue 300)
            '#06b6d4', //  (Cyan 500)
            '#22d3ee', //  (Cyan 400)
            '#818cf8', //  (Indigo 400)
            '#c7d2fe', //  (Indigo 200)
        ];

        const selectedColor = bluePalette[configs.length % bluePalette.length];

        const newZone: ZoneConfig = {
            id: newId,
            label: 'New Category',
            color: selectedColor,
            glow: selectedColor + '66'
        };

        setConfigs([...configs, newZone]);
        setActiveZone(newId);
    };

    const deleteZone = (id: string) => {
        setConfigs(configs.filter(z => z.id !== id));
        setGrid(prev => prev.map(row => row.map(cell => cell === id ? 'aisle' : cell)));
        if (activeZone === id) setActiveZone('aisle');
    };

    const updateZoneLabel = (id: string, label: string) => {
        setConfigs(configs.map(z => z.id === id ? { ...z, label } : z));
    };

    const [grid, setGrid] = useState<ZoneType[][]>(
        Array(10).fill(null).map(() => Array(12).fill('parterre'))
    );

    const saveToHistory = () => {
        const gridCopy = grid.map(row => [...row]);

        setHistory(prev => {
            const newHistory = [...prev, gridCopy];
            return newHistory.length > 20 ? newHistory.slice(1) : newHistory;
        });
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        const previousState = history[history.length - 1];

        setGrid(previousState);

        setHistory(prev => prev.slice(0, -1));

    };

    const toggleSeat = (r: number, c: number) => {
        saveToHistory();
        setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[r][c] = newGrid[r][c] === activeZone ? 'aisle' : activeZone;
            return newGrid;
        });
    };


    const toggleRow = (rIdx: number) => {
        saveToHistory();
        setGrid(prev => prev.map((row, idx) =>
            idx === rIdx ? row.map(() => activeZone) : row
        ));
    };

    const toggleColumn = (cIdx: number) => {
        saveToHistory();
        setGrid(prev => prev.map(row =>
            row.map((cell, idx) => idx === cIdx ? activeZone : cell)
        ));
    };

    const handleResize = () => {
        if (rows > 50 || cols > 50) {
            dispatch(showNotification({ message: "Max size is 50x50", type: "error" }));
            return;
        }
        setGrid(prevGrid =>
            Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) =>
                    (prevGrid[r] && prevGrid[r][c]) ? prevGrid[r][c] : 'parterre'
                )
            )
        );
    };

    const saveHall = async () => {
        const hasSeats = grid.some(row => row.some(cell => cell !== 'aisle'));
        if (!hasSeats) {
            dispatch(showNotification({ message: 'Please add at least one seat!', type: 'error' }));
            return;
        }

        if (!selectedCinemaId) {
            dispatch(showNotification({ message: 'Please select a cinema from the list', type: 'error' }));
            return;
        }

        if (!hallName.trim()) {
            dispatch(showNotification({ message: 'Please enter a name for the hall', type: 'error' }));
            return;
        }

        try {
            const payload = {
                name: hallName,
                cinemaId: selectedCinemaId,
                rows: grid.length,
                cols: grid[0]?.length || 0,
                layoutConfig: {
                    grid,
                    zoneConfigs: configs
                }
            };

            await createHall(payload).unwrap();

            dispatch(showNotification({
                message: `Hall "${hallName}" successfully saved!`,
                type: 'success'
            }));

            navigate('/dashboard');

        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({
                message: errorData.data?.message || 'Server error while saving',
                type: 'error'
            }));
        }
    };

    const getSeatNumber = (row: string[], currentIdx: number) => {
        let count = 0;
        for (let i = 0; i <= currentIdx; i++) {
            if (row[i] !== 'aisle') count++;
        }
        return count;
    };

    return (
        <div className="w-full max-w-6xl p-10 bg-slate-950 rounded-[40px] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    Hall <span className="text-indigo-500">Designer</span>
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 h-20 bg-white/5 px-6 rounded-[24px] border border-white/10 shadow-inner">
                        {/* hallName */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">Hall Name</label>
                            <input
                                value={hallName}
                                onChange={(e) => setHallName(e.target.value)}
                                className="h-10 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 w-40"
                                placeholder="e.g. IMAX 1"
                            />
                        </div>

                        <CinemaSelect
                            selectedId={selectedCinemaId}
                            onSelect={setSelectedCinemaId}
                        />
                    </div>
                    <div className="flex items-center gap-4 h-20 bg-white/5 px-6 rounded-[24px] border border-white/10">
                        <SizeInput label="Rows" val={rows} onChange={setRows} />
                        <SizeInput label="Cols" val={cols} onChange={setCols} />
                        <button onClick={handleResize} className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase mt-4">Apply</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButton svgRef={svgRef} hallName="MyCinema" />

                    <button
                        onClick={saveHall}
                        disabled={isSaving}
                        className={`h-20 px-10 rounded-[24px] font-black uppercase text-xs transition-all ${
                            isSaving ? 'bg-indigo-900 cursor-wait opacity-70' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                    >
                        {isSaving ? 'Saving...' : 'Save Hall'}
                    </button>
                </div>
                </div>
            </div>

            <ZonePicker
                activeZone={activeZone}
                onSelect={setActiveZone}
                configs={configs}
                onUpdateZone={updateZoneLabel}
                onAddZone={addZone}
                onDeleteZone={deleteZone}
            />

            <HallLegend configs={configs} />

            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex gap-2">
                    <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase transition-all ${
                            history.length > 0
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        ↩ Undo
                    </button>

                    <button onClick={() => { saveToHistory(); setGrid(grid.map(row => row.map(() => activeZone))); }} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase">Fill All</button>
                    <button onClick={() => setGrid(grid.map(row => row.map(() => 'aisle')))} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase">Clear All</button>
                </div>
                <button onClick={() => setIsZoomedOut(!isZoomedOut)} className={`px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase ${isZoomedOut ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                    {isZoomedOut ? '🔍 Zoom In' : '🌐 Zoom Out'}
                </button>

            </div>

            {/* --- Seat Statistics Widget --- */}
            <div className="flex flex-wrap gap-6 mb-8 px-6 py-4 bg-white/5 rounded-3xl border border-white/5 items-center">
                <div className="flex items-center gap-2 pr-6 border-r border-white/10">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capacity:</span>
                    <span className="text-xl font-black text-white">
            {grid.flat().filter(cell => cell !== 'aisle').length}
        </span>
                </div>

                <div className="flex flex-wrap gap-6">
                    {configs.map(zone => {
                        const count = grid.flat().filter(cell => cell === zone.id).length;
                        if (count === 0) return null;
                        return (
                            <div key={zone.id} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${zone.color.replace('fill-', 'bg-')}`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {zone.label}: <span className="text-white">{count}</span>
                    </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <HallScreen />

            {/* Grid Rendering */}
            <div className="bg-black/40 rounded-[30px] border border-white/5 overflow-hidden flex flex-col">
                <div className={`overflow-auto p-12 custom-scrollbar ${isZoomedOut ? 'max-h-none' : 'max-h-[600px]'}`}>
                    <div className={`flex justify-center ${isZoomedOut ? 'w-full' : 'min-w-max'}`}>

                        <svg
                            ref={svgRef}
                            width={isZoomedOut ? '100%' : grid[0]?.length * 45 + 50}
                            height={isZoomedOut ? 'auto' : grid.length * 45 + 50}
                            viewBox={`-50 -40 ${grid[0]?.length * 45 + 50} ${grid.length * 45 + 40}`}
                        >
                            {/* Column Headers */}
                            {!isZoomedOut && grid[0]?.map((_, cIdx) => (
                                <g key={cIdx} className="cursor-pointer group/col" onClick={() => toggleColumn(cIdx)}>
                                    <text x={cIdx * 45 + 22.5} y="-15" textAnchor="middle" className="fill-slate-500 group-hover/col:fill-indigo-400 text-[10px] font-black">{cIdx + 1}</text>
                                </g>
                            ))}

                            {/* Rows */}
                            {grid.map((row, rIdx) => (
                                <g key={rIdx}>
                                    {/* Number row */}
                                    <g className="cursor-pointer group/row" onClick={() => toggleRow(rIdx)}>
                                        <text x="-27" y={rIdx * 45 + 28} className="fill-slate-500 group-hover:fill-indigo-400 text-[12px] font-black" textAnchor="middle">
                                            {rIdx + 1}
                                        </text>
                                    </g>

                                    {row.map((zoneId, cIdx) => {
                                        const zoneConfig = configs.find(z => z.id === zoneId);
                                        return (
                                            <g key={`${rIdx}-${cIdx}`} className="cursor-pointer group" onClick={() => toggleSeat(rIdx, cIdx)}>
                                                <rect
                                                    x={cIdx * 45 + 5}
                                                    y={rIdx * 45 + 5}
                                                    width="35"
                                                    height="35"
                                                    rx="8"
                                                    fill={zoneId === 'aisle' ? 'rgba(255,255,255,0.05)' : (zoneConfig?.color || '#4f46e5')}
                                                    className="transition-all duration-200 stroke-white/10 group-hover:scale-110 origin-center"
                                                    style={{
                                                        transformOrigin: `${cIdx * 45 + 22.5}px ${rIdx * 45 + 22.5}px`,
                                                        filter: zoneId !== 'aisle' ? `drop-shadow(0 0 5px ${zoneConfig?.color}44)` : 'none'
                                                    }}
                                                />
                                                {!isZoomedOut && zoneId !== 'aisle' && (
                                                    <text
                                                        x={cIdx * 45 + 22.5}
                                                        y={rIdx * 45 + 27}
                                                        textAnchor="middle"
                                                        className="fill-white/80 text-[10px] font-black pointer-events-none"
                                                    >
                                                        {getSeatNumber(row, cIdx)}
                                                    </text>
                                                )}
                                            </g>
                                        );
                                    })}
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const SizeInput = ({ label, val, onChange }: SizeInputProps) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
            {label}
        </label>
        <input
            type="number"
            value={val}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white w-20 outline-none focus:border-indigo-500 transition-colors"
        />
    </div>
);

export default CreateHallPage;
