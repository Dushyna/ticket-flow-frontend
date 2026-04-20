import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="w-full py-6 bg-black/40 backdrop-blur-sm border-t border-white/10 text-center">
            <p className="text-slate-400 text-xs font-medium">
                &copy; {new Date().getFullYear()} TicketFlow SaaS. {t('footer.rights')}
            </p>
        </footer>
    );
};

export default Footer;
