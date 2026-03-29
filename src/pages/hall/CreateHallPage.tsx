import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '../../features/notifications/slice/notificationSlice.ts';

import { HallHeader } from './HallHeader';
import { HallStats } from './HallStats';
import { HallSvgGrid } from './HallSvgGrid';
import ZonePicker from './ZonePicker';
import HallLegend from './HallLegend';
import HallScreen from './HallScreen';

import {INITIAL_ZONES, type ZoneConfig, type ZoneType} from './types.ts';
import { useHallEditor } from '../../features/cinema/hooks/useHallEditor';
import {
    useCreateHallMutation,
    useGetHallByIdQuery,
    useUpdateHallMutation
} from '../../features/cinema/services/cinemaApi';

const CreateHallPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hallId } = useParams<{ hallId: string }>();
    const svgRef = useRef<SVGSVGElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isZoomedOut, setIsZoomedOut] = useState(false);
    const [activeZone, setActiveZone] = useState<ZoneType>('parterre');

    const {
        hallData, setHallData,
        toggleSeat, toggleRow, toggleColumn,
        handleUndo, fillAll, history
    } = useHallEditor({
        name: 'New Hall',
        cinemaId: '',
        rows: 10,
        cols: 12,
        grid: Array(10).fill(null).map(() => Array(12).fill('parterre')),
        configs: INITIAL_ZONES
    });

    const { data: existingHall, isSuccess } = useGetHallByIdQuery(hallId || '', { skip: !hallId });
    const [createHall, { isLoading: isCreating }] = useCreateHallMutation();
    const [updateHall, { isLoading: isUpdating }] = useUpdateHallMutation();
    const isProcessing = isCreating || isUpdating;

    const addZone = () => {
        const newId = `z${Date.now()}`;
        const bluePalette = [
            '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd',
            '#06b6d4', '#22d3ee', '#818cf8', '#c7d2fe'
        ];

        const selectedColor = bluePalette[hallData.configs.length % bluePalette.length];

        const newZone: ZoneConfig = {
            id: newId,
            label: 'New Category',
            color: selectedColor,
            glow: selectedColor + '66'
        };

        setHallData(prev => ({
            ...prev,
            configs: [...prev.configs, newZone]
        }));
        setActiveZone(newId);
    };

    const deleteZone = (id: string) => {
        setHallData(prev => ({
            ...prev,
            configs: prev.configs.filter(z => z.id !== id),
            grid: prev.grid.map(row => row.map(cell => cell === id ? 'aisle' : cell))
        }));

        if (activeZone === id) setActiveZone('aisle');
    };

    const updateZoneLabel = (id: string, label: string) => {
        setHallData(prev => ({
            ...prev,
            configs: prev.configs.map(z => z.id === id ? { ...z, label } : z)
        }));
    };

    const handleResize = (newRows: number, newCols: number) => {
        if (newRows > 50 || newCols > 50) {
            dispatch(showNotification({ message: "Max size is 50x50", type: "error" }));
            return;
        }

        setHallData(prev => ({
            ...prev,
            rows: newRows,
            cols: newCols,
            grid: Array.from({ length: newRows }, (_, r) =>
                Array.from({ length: newCols }, (_, c) =>
                    (prev.grid[r] && prev.grid[r][c]) ? prev.grid[r][c] : 'parterre'
                )
            )
        }));
    };



    useEffect(() => {
        if (isSuccess && existingHall && !isInitialized) {
            const timeoutId = setTimeout(() => {
                setHallData({
                    name: existingHall.name,
                    cinemaId: existingHall.cinemaId,
                    rows: existingHall.rowsCount,
                    cols: existingHall.colsCount,
                    grid: existingHall.layoutConfig?.grid || [],
                    configs: existingHall.layoutConfig?.zoneConfigs || INITIAL_ZONES
                });
                setIsInitialized(true);
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [isSuccess, existingHall, isInitialized, setHallData]);

    const saveHall = async () => {
        if (!hallData.grid.flat().some(cell => cell !== 'aisle')) {
            dispatch(showNotification({ message: 'Add at least one seat!', type: 'error' }));
            return;
        }
        if (!hallData.cinemaId) {
            dispatch(showNotification({ message: 'Select a cinema!', type: 'error' }));
            return;
        }

        try {
            const payload = {
                name: hallData.name,
                cinemaId: hallData.cinemaId,
                rows: hallData.grid.length,
                cols: hallData.grid[0]?.length || 0,
                layoutConfig: { grid: hallData.grid, zoneConfigs: hallData.configs }
            };

            if (hallId) {
                await updateHall({ id: hallId, body: payload }).unwrap();
            } else {
                await createHall(payload).unwrap();
            }

            dispatch(showNotification({ message: `Hall saved!`, type: 'success' }));
            navigate('/dashboard');
        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({
                message: errorData.data?.message || 'Error saving',
                type: 'error' }));
        }
    };

    return (
        <div className="w-full max-w-6xl p-10 bg-slate-950 rounded-[40px] border border-white/10 shadow-2xl">
            <HallHeader
                hallData={hallData}
                setHallData={setHallData}
                onSave={saveHall}
                onResize={handleResize}
                isProcessing={isProcessing}
                hallId={hallId}
                svgRef={svgRef}
            />

            <ZonePicker
                activeZone={activeZone}
                onSelect={setActiveZone}
                configs={hallData.configs}
                onUpdateZone={updateZoneLabel}
                onAddZone={addZone}
                onDeleteZone={deleteZone}
            />

            <HallLegend configs={hallData.configs} />

            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex gap-2">
                    <button onClick={handleUndo} disabled={history.length === 0} className="...">Undo</button>
                    <button onClick={() => fillAll(activeZone)} className="...">Fill All</button>
                </div>
                <button onClick={() => setIsZoomedOut(!isZoomedOut)} className="...">
                    {isZoomedOut ? '🔍 Zoom In' : '🌐 Zoom Out'}
                </button>
            </div>

            <HallStats grid={hallData.grid} configs={hallData.configs} />
            <HallScreen />

            <HallSvgGrid
                grid={hallData.grid}
                configs={hallData.configs}
                onSeatClick={(r, c) => toggleSeat(r, c, activeZone)}
                onRowClick={(r) => toggleRow(r, activeZone)}
                onColumnClick={(c) => toggleColumn(c, activeZone)}
                isZoomedOut={isZoomedOut}
                svgRef={svgRef}
            />
        </div>
    );
};

export default CreateHallPage;
