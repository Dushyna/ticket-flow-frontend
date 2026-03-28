import React from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../features/notifications/slice/notificationSlice';

interface ExportButtonProps {
    svgRef: React.RefObject<SVGSVGElement | null>;
    hallName?: string;
}

const ExportButton = ({ svgRef, hallName = 'cinema-hall' }: ExportButtonProps) => {
    const dispatch = useDispatch();

    const handleExport = () => {
        const svg = svgRef.current;
        if (!svg) return;

        const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
        const style = document.createElement('style');
        style.textContent = `
        text { fill: #64748b !important; font-family: sans-serif; font-weight: bold; font-size: 11px; }
        .fill-white\\/80 { fill: rgba(255, 255, 255, 0.8) !important; }
    `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const bbox = svg.getBBox();

        const margin = 40;
        const extraSpace = 60;

        canvas.width = bbox.width + margin + extraSpace;
        canvas.height = bbox.height + margin + extraSpace;

        img.onload = () => {
            if (!ctx) return;

            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const offsetX = margin - bbox.x;
            const offsetY = margin - bbox.y;

            ctx.drawImage(img, offsetX, offsetY);

            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${hallName}-layout.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            URL.revokeObjectURL(url);
            dispatch(showNotification({ message: 'Exported with proper spacing!', type: 'success' }));
        };

        img.src = url;
    };

    return (
        <button
            onClick={handleExport}
            className="h-20 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center justify-center gap-2 group shadow-lg active:scale-95"
        >
            <span className="text-xl group-hover:scale-125 transition-transform">📸</span>
            Export PNG
        </button>
    );
};

export default ExportButton;
