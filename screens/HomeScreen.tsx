
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

interface Notice {
    id: number;
    title: string;
    description: string;
    type: 'maintenance' | 'water' | 'electricity' | 'info' | 'emergency';
    date: string;
}

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('resident_user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        const loadNotices = () => {
            const stored = localStorage.getItem('community_notices');
            if (stored) {
                setNotices(JSON.parse(stored));
            } else {
                setNotices([
                    {
                        id: 0,
                        title: 'Bienvenidos a Puerto Azul',
                        description: 'Ya puedes gestionar tus pases y solicitudes desde la aplicación.',
                        type: 'info',
                        date: new Date().toISOString()
                    }
                ]);
            }
        };

        loadNotices();
    }, []);
    
    const handleOpenGatekeeperChat = () => {
        window.open('https://wa.me/573153677824', '_blank');
    };

    const handleOpenManual = () => {
        // Enlace al manual de convivencia (PDF)
        window.open('https://pdfobject.com/pdf/sample.pdf', '_blank');
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'maintenance': return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300';
            case 'water': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
            case 'electricity': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400';
            case 'emergency': return 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300';
        }
    };

    const getIconName = (type: string) => {
        switch (type) {
            case 'maintenance': return 'build';
            case 'water': return 'water_drop';
            case 'electricity': return 'bolt';
            case 'emergency': return 'warning';
            default: return 'info';
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'Hace un momento';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden pb-32 bg-background-light dark:bg-background-dark transition-colors">
            <header className="flex items-center justify-between p-6 pb-2 pt-4 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-primary/20 shadow-sm" style={{backgroundImage: 'url("https://i.pravatar.cc/150?u=carlos")'}}>
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></div>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 leading-tight">Propietario</p>
                        <h2 className="text-xl font-black leading-tight text-slate-900 dark:text-white">{currentUser?.name || 'Cargando...'}</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <ThemeToggle />
                    <button 
                        onClick={handleOpenGatekeeperChat}
                        className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-white/5 shadow-sm hover:scale-105 transition-transform relative text-slate-900 dark:text-white"
                    >
                        <span className="material-symbols-outlined" style={{fontSize: '22px'}}>notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark animate-pulse"></span>
                    </button>
                </div>
            </header>
            
            <div className="px-6 pb-6 text-left">
                <div className="flex items-center gap-2 opacity-80">
                    <span className="material-symbols-outlined text-primary" style={{fontSize: '18px'}}>location_on</span>
                    <p className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wide">Unidad {currentUser?.unitCode || '402-B'} • Puerto Azul</p>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8">
                <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400 dark:text-gray-500 text-left">Acciones Rápidas</h4>
                    <div className="grid grid-cols-4 gap-4">
                        <Link to="/reservations" className="flex flex-col items-center gap-2 group">
                            <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>calendar_month</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 dark:text-gray-400">Reservar</span>
                        </Link>
                        <Link to="/new-request" className="flex flex-col items-center gap-2 group">
                            <div className="size-14 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>support_agent</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 dark:text-gray-400">PQR</span>
                        </Link>
                        <Link to="/financial-dashboard" className="flex flex-col items-center gap-2 group">
                            <div className="size-14 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>monitoring</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 dark:text-gray-400">Finanzas</span>
                        </Link>
                        <Link to="/generate-qr" className="flex flex-col items-center gap-2 group">
                            <div className="size-14 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>group_add</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 dark:text-gray-400">Visitas</span>
                        </Link>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">Avisos Recientes</h4>
                        <button onClick={() => navigate('/admin/notices')} className="text-[9px] font-black text-primary uppercase">Ver Todo</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {notices.slice(0, 3).map((notice) => (
                            <div key={notice.id} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 items-start animate-slide-up">
                                <div className={`shrink-0 size-10 rounded-2xl flex items-center justify-center ${getIconColor(notice.type)}`}>
                                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>{getIconName(notice.type)}</span>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{notice.title}</h5>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1">{notice.description}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">{getTimeAgo(notice.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <nav className="fixed bottom-0 w-full z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-[#366348] pb-6 pt-2 max-w-md mx-auto">
                <div className="flex justify-around items-center">
                    <button className="flex flex-col items-center gap-1 p-2 text-primary">
                        <span className="material-symbols-outlined filled">home</span>
                        <span className="text-[9px] font-black uppercase">Inicio</span>
                    </button>
                    <button onClick={handleOpenManual} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">menu_book</span>
                        <span className="text-[9px] font-black uppercase">Manual</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[9px] font-black uppercase">Ajustes</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default HomeScreen;
