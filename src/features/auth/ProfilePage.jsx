import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Globe } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/auth');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="pb-24 pt-8 px-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">{t('profile.title')}</h1>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={32} />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-slate-800">{user?.user_metadata?.username || 'User'}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Globe size={18} />
                        {t('profile.language')}
                    </h3>
                </div>
                <div className="p-2">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors ${i18n.language === 'en' ? 'bg-slate-50 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <span>{t('profile.english')}</span>
                        {i18n.language === 'en' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </button>
                    <button
                        onClick={() => changeLanguage('zh')}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors ${i18n.language === 'zh' ? 'bg-slate-50 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <span>{t('profile.chinese')}</span>
                        {i18n.language === 'zh' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </button>
                </div>
            </div>

            <button
                onClick={handleSignOut}
                className="w-full bg-rose-50 text-rose-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
            >
                <LogOut size={20} />
                {t('profile.signOut')}
            </button>
        </div>
    );
}
