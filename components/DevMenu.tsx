
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const DevMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center size-10 rounded-full transition-all duration-300 border shadow-lg ${
                    isOpen 
                    ? 'bg-primary border-primary text-black' 
                    : 'bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-primary backdrop-blur-md'
                }`}
                title="Menú de Desarrollador"
            >
                <span className={`material-symbols-outlined ${isOpen ? 'filled' : ''}`} style={{ fontSize: '20px' }}>
                    {isOpen ? 'close' : 'engineering'}
                </span>
            </button>

            {isOpen && (
                <div className="mt-2 flex flex-col gap-1.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 p-2 rounded-2xl w-48 shadow-2xl animate-zoom-in backdrop-blur-xl">
                    <p className="px-2 py-1 text-[9px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 mb-1 text-center">Navegación Rápida</p>
                    
                    <button onClick={() => { navigate('/'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Landing Page</button>
                    <button onClick={() => { navigate('/resident/login'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/resident/login' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Residente: Login</button>
                    <button onClick={() => { navigate('/home'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/home' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Residente: Dashboard</button>
                    
                    <div className="h-px bg-gray-100 dark:bg-white/5 my-1"></div>
                    
                    <button onClick={() => { navigate('/admin/panel'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/admin/panel' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Admin: Panel Control</button>
                    <button onClick={() => { navigate('/admin/financials'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/admin/financials' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Admin: Finanzas</button>
                    <button onClick={() => { navigate('/admin/pqr'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/admin/pqr' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Admin: Gestión PQR</button>
                    
                    <div className="h-px bg-gray-100 dark:bg-white/5 my-1"></div>
                    
                    <button onClick={() => { navigate('/gatekeeper'); setIsOpen(false); }} className={`text-left text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${location.pathname === '/gatekeeper' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300'}`}>Portería: Panel</button>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between px-2">
                        <span className="text-[9px] font-black uppercase text-gray-400">Tema</span>
                        <ThemeToggle className="!size-7" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevMenu;
