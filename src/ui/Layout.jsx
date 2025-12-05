import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Library, PlusCircle, User } from 'lucide-react';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pb-20">
      {/* Main Content Area */}
      <main className="container mx-auto max-w-md min-h-screen">
        <Outlet />
      </main>

      {/* Bottom Navigation - Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/20 z-50">
        <div className="container mx-auto max-w-md flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-primary' : 'text-muted'}`
            }
          >
            <Home size={24} />
            <span className="text-[10px] mt-1 font-medium">{t('nav.focus')}</span>
          </NavLink>

          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-primary' : 'text-muted'}`
            }
          >
            <Library size={24} />
            <span className="text-[10px] mt-1 font-medium">{t('nav.library')}</span>
          </NavLink>

          <NavLink
            to="/add"
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-full shadow-glow transform transition-transform active:scale-95">
              <PlusCircle size={28} />
            </div>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-primary' : 'text-muted'}`
            }
          >
            <User size={24} />
            <span className="text-[10px] mt-1 font-medium">{t('nav.profile')}</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
