import { useState } from "react";
import {  type ZoneType, type ZoneConfig } from "../../../pages/hall/types";

interface HallEditorState {
    name: string;
    cinemaId: string;
    rows: number;
    cols: number;
    grid: ZoneType[][];
    configs: ZoneConfig[];
}

export const useHallEditor = (initialData: HallEditorState) => {
    const [hallData, setHallData] = useState<HallEditorState>(initialData);
    const [history, setHistory] = useState<ZoneType[][][]>([]);

    const saveToHistory = () => {
        setHistory(prev => [...prev, hallData.grid.map((row: ZoneType[]) => [...row])].slice(-20));
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const previousGrid = history[history.length - 1];
        setHallData((prev) => ({ ...prev, grid: previousGrid }));
        setHistory(prev => prev.slice(0, -1));
    };

    const toggleSeat = (r: number, c: number, activeZone: ZoneType) => {
        saveToHistory();
        setHallData((prev) => ({
            ...prev,
            grid: prev.grid.map((row, ri) =>
                ri === r
                    ? row.map((cell, ci) => ci === c ? (cell === activeZone ? 'aisle' : activeZone) : cell)
                    : row
            )
        }));
    };

    const toggleRow = (rIdx: number, activeZone: ZoneType) => {
        saveToHistory();
        setHallData((prev) => ({
            ...prev,
            grid: prev.grid.map((row, idx) =>
                idx === rIdx ? row.map(() => activeZone) : row
            )
        }));
    };

    const toggleColumn = (cIdx: number, activeZone: ZoneType) => {
        saveToHistory();
        setHallData((prev) => ({
            ...prev,
            grid: prev.grid.map(row =>
                row.map((cell, idx) => idx === cIdx ? activeZone : cell)
            )
        }));
    };

    const fillAll = (zone: ZoneType) => {
        saveToHistory();
        setHallData(prev => ({
            ...prev,
            grid: prev.grid.map(row => row.map(() => zone))
        }));
    };

    return {
        hallData,
        setHallData,
        toggleSeat,
        toggleRow,
        toggleColumn,
        handleUndo,
        fillAll,
        history
    };
};
