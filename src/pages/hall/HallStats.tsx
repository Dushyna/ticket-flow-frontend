import type {ZoneConfig, ZoneType} from "./types.ts";

interface HallStatsProps {
    grid: ZoneType[][];
    configs: ZoneConfig[];
}

export const HallStats = ({ grid, configs }: HallStatsProps) => {
    const flatGrid = grid.flat();
    const capacity = flatGrid.filter(cell => cell !== 'aisle').length;

    return (
        <div className="flex flex-wrap gap-6 mb-8 px-6 py-4 bg-white/5 rounded-3xl border border-white/5 items-center">
            <div className="flex items-center gap-2 pr-6 border-r border-white/10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Capacity:
                </span>
                <span className="text-xl font-black text-white">
                    {capacity}
                </span>
            </div>

            <div className="flex flex-wrap gap-6">
                {configs.map(zone => {
                    const count = flatGrid.filter(cell => cell === zone.id).length;
                    if (count === 0) return null;

                    return (
                        <div key={zone.id} className="flex items-center gap-2">
                            {/* Перетворюємо tailwind fill- колір у bg- колір для кружечка */}
                            <div className={`w-2 h-2 rounded-full ${zone.color.replace('fill-', 'bg-')}`} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                {zone.label}: <span className="text-white">{count}</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

