import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import React from 'react';

type FlagType = React.ComponentType<{ code: string; style?: React.CSSProperties; className?: string }>;

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', flag: 'GB' },
        { code: 'de', flag: 'DE' },
        { code: 'uk', flag: 'UA' }
    ];

    const FlagComponent = ((Flag as unknown) as { default: FlagType }).default || (Flag as FlagType);

    return (
        <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                        i18n.language?.startsWith(lang.code)
                            ? 'bg-indigo-600/40 border-indigo-500/50 border'
                            : 'hover:bg-white/5 border border-transparent'
                    }`}
                >
                    <FlagComponent code={lang.flag} style={{ width: '20px', height: '15px' }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {lang.code}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
