import React from 'react';
import type {ZoneConfig, ZoneType} from "./types.ts";

interface HallSvgGridProps {
    grid: ZoneType[][];
    configs: ZoneConfig[];
    onSeatClick: (r: number, c: number) => void;
    onRowClick: (r: number) => void;
    onColumnClick: (c: number) => void;
    isZoomedOut: boolean;
    svgRef: React.RefObject<SVGSVGElement | null>;
    selectedSeats?: { r: number, c: number }[];
    occupiedSeats?: { row: number; col: number }[];
}

export const HallSvgGrid = ({
                                grid,
                                configs,
                                onSeatClick,
                                onRowClick,
                                onColumnClick,
                                isZoomedOut,
                                svgRef,
                                selectedSeats,
                                occupiedSeats
                            }: HallSvgGridProps) => {

    const getSeatNumber = (row: ZoneType[], currentIdx: number) => {
        let count = 0;
        for (let i = 0; i <= currentIdx; i++) {
            if (row[i] !== 'aisle') count++;
        }
        return count;
    };

    return (
        <div className="bg-black/40 rounded-[30px] border border-white/5 overflow-hidden flex flex-col">
            <div className={`overflow-auto p-12 custom-scrollbar ${isZoomedOut ? 'max-h-none' : 'max-h-[600px]'}`}>
                <div className={`flex justify-center ${isZoomedOut ? 'w-full' : 'min-w-max'}`}>
                    <svg
                        ref={svgRef}
                        width={isZoomedOut ? '100%' : grid[0]?.length * 45 + 50}
                        height={isZoomedOut ? 'auto' : grid.length * 45 + 50}
                        viewBox={`-50 -40 ${grid[0]?.length * 45 + 50} ${grid.length * 45 + 40}`}
                    >
                        {/* Headers column */}
                        {!isZoomedOut && grid[0]?.map((_, cIdx) => (
                            <g key={cIdx} className="cursor-pointer group/col" onClick={() => onColumnClick(cIdx)}>
                                <text
                                    x={cIdx * 45 + 22.5} y="-15" textAnchor="middle"
                                    className="fill-slate-500 group-hover/col:fill-indigo-400 text-[10px] font-black"
                                >
                                    {cIdx + 1}
                                </text>
                            </g>
                        ))}

                        {/* Rows */}
                        {grid.map((row, rIdx) => (
                            <g key={rIdx}>
                                {/* Number Rows */}
                                <g className="cursor-pointer group/row" onClick={() => onRowClick(rIdx)}>
                                    <text
                                        x="-27" y={rIdx * 45 + 28} textAnchor="middle"
                                        className="fill-slate-500 group-hover/row:fill-indigo-400 text-[12px] font-black"
                                    >
                                        {rIdx + 1}
                                    </text>
                                </g>

                                {row.map((zoneId, cIdx) => {
                                    const zoneConfig = configs.find(z => z.id === zoneId);
                                    const isAisle = zoneId === 'aisle';
                                    const isOccupied = occupiedSeats?.some((s: {row: number, col: number}) => s.row === rIdx && s.col === cIdx);
                                    const isSelected = selectedSeats?.some((s: {r: number, c: number}) => s.r === rIdx && s.c === cIdx);
                                    return (
                                        <g
                                            key={`${rIdx}-${cIdx}`}
                                            className={`${isOccupied ? 'cursor-not-allowed' : 'cursor-pointer'} group`}
                                            onClick={() => !isOccupied && onSeatClick(rIdx, cIdx)}
                                        >
                                            <rect
                                                x={cIdx * 45 + 5}
                                                y={rIdx * 45 + 5}
                                                width="35"
                                                height="35"
                                                rx="8"
                                                fill={
                                                    isOccupied ? '#7f1d1d' :
                                                        isSelected ? '#fbbf24' :
                                                            isAisle ? 'rgba(255,255,255,0.05)' :
                                                                (zoneConfig?.color || '#4f46e5')
                                                }
                                                className={`transition-all duration-200 origin-center ${
                                                    isOccupied ? 'stroke-red-500/50' : 'stroke-white/10 group-hover:scale-110'
                                                }`}
                                                style={{
                                                    transformOrigin: `${cIdx * 45 + 22.5}px ${rIdx * 45 + 22.5}px`,
                                                    filter: isSelected ? 'drop-shadow(0 0 8px #fbbf24)' : isOccupied ? 'saturate(1.5)' : 'none'
                                                }}
                                            />
                                            {!isZoomedOut && !isAisle && !isOccupied && (
                                                <text
                                                    x={cIdx * 45 + 22.5}
                                                    y={rIdx * 45 + 27}
                                                    textAnchor="middle"
                                                    className="fill-white/80 text-[10px] font-black pointer-events-none"
                                                >
                                                    {getSeatNumber(row, cIdx)}
                                                </text>
                                            )}
                                            {!isZoomedOut && isOccupied && (
                                                <text
                                                    x={cIdx * 45 + 22.5}
                                                    y={rIdx * 45 + 27}
                                                    textAnchor="middle"
                                                    className="fill-red-200/50 text-[14px] font-black pointer-events-none"
                                                >
                                                    ✕
                                                </text>
                                            )}                                        </g>
                                    );
                                })}
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};
