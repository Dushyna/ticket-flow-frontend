import {type ZoneConfig} from './types';

const ZonePicker = ({
                        activeZone,
                        onSelect,
                        configs,
                        onUpdateZone,
                        onAddZone,
                        onDeleteZone
                    }: {
    activeZone: string;
    onSelect: (id: string) => void;
    configs: ZoneConfig[];
    onUpdateZone: (id: string, label: string, multiplier: number) => void;
    onAddZone: () => void;
    onDeleteZone: (id: string) => void;
}) => {

    return (
        <div className="flex flex-col gap-4 mb-10">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Manage Zones</h2>
                <button
                    onClick={onAddZone}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg hover:shadow-blue-500/20"
                >
                    + Add New Zone
                </button>
            </div>

            <div
                className="flex flex-wrap gap-4 p-6 bg-white/5 rounded-[32px] border border-white/10 shadow-2xl items-center">
                {configs.map((zone) => (
                    <div
                        key={zone.id}
                        onClick={() => onSelect(zone.id)}
                        className={`group flex flex-col gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer min-w-[160px] relative ${
                            activeZone === zone.id ? 'bg-slate-900 border-white scale-105' : 'bg-black/20 border-white/5 hover:bg-white/5'
                        }`}
                        style={{boxShadow: activeZone === zone.id ? `0 0 20px ${zone.glow}` : 'none'}}
                    >
                        {/* Delete Button */}
                        {configs.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteZone(zone.id);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center justify-center shadow-lg z-20 hover:scale-110"
                            >
                                ×
                            </button>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shadow-sm"
                                    style={{backgroundColor: zone.color}}
                                />
                                <input
                                    type="text"
                                    value={zone.label}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => onUpdateZone(zone.id, e.target.value, zone.multiplier || 1.0)}
                                    className={`bg-transparent border-none outline-none text-[10px] font-black uppercase w-full transition-colors ${
                                        activeZone === zone.id ? 'text-white' : 'text-slate-400 focus:text-white'
                                    }`}
                                    placeholder="Zone Name"
                                />
                            </div>
                            <div
                                className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded-lg border border-white/5 w-fit">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Price x</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={zone.multiplier || 1.0}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => onUpdateZone(zone.id, zone.label, parseFloat(e.target.value) || 1.0)}
                                    className="bg-transparent border-none outline-none text-[10px] font-black text-indigo-400 w-10"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Eraser */}
                <button
                    onClick={() => onSelect('aisle')}
                    className={`h-[68px] px-6 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        activeZone === 'aisle'
                            ? 'bg-white/20 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105'
                            : 'bg-black/20 border-white/5 border-dashed text-slate-500 hover:bg-white/5'
                    }`}
                >
                    <span className="text-lg">🧽</span>
                    <span className="text-[10px] font-black uppercase">Eraser</span>
                </button>
            </div>
        </div>
    );
};

export default ZonePicker;
