import React, { useState } from "react";
import CinemaSelect from "./CinemaSelect.tsx";
import ExportButton from "./ExportButton.tsx";
import type {SizeInputProps, ZoneConfig, ZoneType} from "./types.ts";
import { useTranslation } from 'react-i18next';

interface HallData {
    name: string;
    cinemaId: string;
    rows: number;
    cols: number;
    grid: ZoneType[][];
    configs: ZoneConfig[];
}

interface HallHeaderProps {
    hallData: HallData;
    setHallData: React.Dispatch<React.SetStateAction<HallData>>;
    onSave: () => Promise<void>;
    onResize: (rows: number, cols: number) => void;
    isProcessing: boolean;
    hallId: string | undefined;
    svgRef: React.RefObject<SVGSVGElement | null>;
}

export const HallHeader = ({
                               hallData,
                               setHallData,
                               onSave,
                               onResize,
                               isProcessing,
                               hallId,
                               svgRef
                           }: HallHeaderProps) => {
    const [localRows, setLocalRows] = useState(hallData.rows);
    const [localCols, setLocalCols] = useState(hallData.cols);
    const { t } = useTranslation();

    return (
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {t('hall_editor.title_hall')} <span className="text-indigo-500">{t('hall_editor.title_designer')}</span>
            </h1>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-6 h-20 bg-white/5 px-6 rounded-[24px] border border-white/10 shadow-inner">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">{t('hall_editor.label_name')}</label>
                        <input
                            value={hallData.name}
                            onChange={(e) => setHallData(prev => ({...prev, name: e.target.value}))}
                            className="h-10 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 w-40"
                            placeholder={t('hall_editor.placeholder_name')}
                        />
                    </div>

                    <CinemaSelect
                        selectedId={hallData.cinemaId}
                        onSelect={(id) => setHallData(prev => ({...prev, cinemaId: id}))}
                    />
                </div>

                <div className="flex items-center gap-4 h-20 bg-white/5 px-6 rounded-[24px] border border-white/10">
                    <SizeInput label={t('hall_editor.label_rows')} val={localRows} onChange={setLocalRows}/>
                    <SizeInput label={t('hall_editor.label_cols')} val={localCols} onChange={setLocalCols}/>
                    <button
                        onClick={() => onResize(localRows, localCols)}
                        className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase mt-4"
                    >
                        {t('common.apply')}
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <ExportButton svgRef={svgRef} hallName={hallData.name}/>
                    <button
                        onClick={onSave}
                        disabled={isProcessing}
                        className={`h-20 px-10 rounded-[24px] font-black uppercase text-xs transition-all ${
                            isProcessing
                                ? 'bg-indigo-900 cursor-wait opacity-70'
                                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 text-white'
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] opacity-50 lowercase font-bold tracking-normal mb-1">
                                {hallId ? t('hall_editor.mode_edit') : t('hall_editor.mode_new')}
                            </span>
                            {isProcessing ? t('common.processing') : t('hall_editor.btn_save')}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const SizeInput = ({label, val, onChange}: SizeInputProps) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{label}</label>
        <input
            type="number"
            value={val}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white w-20 outline-none focus:border-indigo-500 transition-colors"
        />
    </div>
);
