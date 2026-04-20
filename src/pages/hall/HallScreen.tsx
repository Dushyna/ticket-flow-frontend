import { useTranslation } from 'react-i18next';

const HallScreen = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full flex flex-col items-center mb-16 mt-8 px-20">
            <div className="w-full max-w-4xl relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full shadow-[0_0_35px_rgba(56,189,248,0.6)]" />

                <div className="flex justify-center gap-64 mt-2 opacity-10">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-blue-400 to-transparent rotate-[15deg]" />
                    <div className="w-[1px] h-16 bg-gradient-to-b from-blue-400 to-transparent" />
                    <div className="w-[1px] h-12 bg-gradient-to-b from-blue-400 to-transparent -rotate-[15deg]" />
                </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-[1.5em] text-cyan-400 mt-6 text-center ml-[1.5em]">
               {t('hall_editor.screen_area')}
            </span>
        </div>
    );
};

export default HallScreen;
