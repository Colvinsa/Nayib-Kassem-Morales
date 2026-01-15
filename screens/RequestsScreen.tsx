
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface PQR {
    id: string;
    ticketId: string;
    resident: string;
    username: string;
    unit: string;
    type: string;
    subject: string;
    description: string;
    date: string;
    status: 'Pendiente' | 'En Revisión' | 'En Proceso' | 'Resuelto';
    priority?: 'Alta' | 'Media' | 'Normal';
    responseTime?: string;
}

const RequestsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [userPQRs, setUserPQRs] = useState<PQR[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Permitir que otras pantallas fuercen la pestaña de historial si es necesario
        if (location.state && (location.state as any).initialTab) {
            setActiveTab((location.state as any).initialTab);
        }

        const user = localStorage.getItem('resident_user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUser(parsedUser);
            
            const allPQRs: PQR[] = JSON.parse(localStorage.getItem('admin_pqrs') || '[]');
            const filtered = allPQRs.filter(p => p.username === parsedUser.username);
            setUserPQRs(filtered);
        }
    }, [location.state]);

    const activeRequests = userPQRs.filter(p => p.status !== 'Resuelto');
    const historyRequests = userPQRs.filter(p => p.status === 'Resuelto');
    
    const displayList = activeTab === 'active' ? activeRequests : historyRequests;

    const handleOpenManual = () => {
        window.open('https://pdfobject.com/pdf/sample.pdf', '_blank');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-[#366348]">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button onClick={() => navigate('/home')} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-highlight transition-colors text-gray-900 dark:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Trazabilidad</h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-text-secondary">PQR de la Unidad {currentUser?.unitCode}</p>
                    </div>
                    <Link to="/new-request" className="flex size-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary">add</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col w-full pb-32">
                <div className="pt-2 sticky top-[68px] z-40 bg-background-light dark:bg-background-dark">
                    <div className="flex border-b border-gray-200 dark:border-[#366348] px-4 justify-between">
                        <button onClick={() => setActiveTab('active')} className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 flex-1 transition-all ${activeTab === 'active' ? 'border-b-primary text-gray-900 dark:text-white' : 'border-b-transparent text-gray-500 dark:text-text-secondary'}`}>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">En Curso</p>
                                {activeRequests.length > 0 && <span className="size-5 rounded-full bg-primary text-black text-[10px] flex items-center justify-center font-black">{activeRequests.length}</span>}
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 flex-1 transition-all ${activeTab === 'history' ? 'border-b-primary text-gray-900 dark:text-white' : 'border-b-transparent text-gray-500 dark:text-text-secondary'}`}>
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Historial</p>
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {displayList.length > 0 ? (
                        displayList.map((pqr) => (
                            <div key={pqr.id} className="flex flex-col gap-0 rounded-2xl bg-white dark:bg-surface-dark shadow-sm overflow-hidden border border-gray-100 dark:border-white/5 animate-slide-up">
                                <div className="p-5 pb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-2 items-center">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-full border uppercase ${
                                                pqr.status === 'Pendiente' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                pqr.status === 'Resuelto' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                                {pqr.status}
                                            </span>
                                            <span className="text-gray-400 dark:text-gray-500 text-[10px] font-mono">{pqr.ticketId}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400">{new Date(pqr.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{pqr.subject}</h4>
                                    <p className="text-xs text-gray-500 dark:text-text-secondary mb-4 line-clamp-2 leading-relaxed">{pqr.description}</p>
                                    
                                    <div className="relative flex items-center justify-between w-full mt-2 mb-2 px-1">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 dark:bg-surface-highlight rounded-full"></div>
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary rounded-full transition-all duration-700 ${
                                            pqr.status === 'Pendiente' ? 'w-0' : 
                                            pqr.status === 'En Revisión' ? 'w-1/3' :
                                            pqr.status === 'En Proceso' ? 'w-2/3' : 'w-full'
                                        }`}></div>
                                        
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={`relative z-10 size-4 rounded-full border-2 border-background-light dark:border-surface-dark flex items-center justify-center ${
                                                (i === 0) || 
                                                (i === 1 && ['En Revisión', 'En Proceso', 'Resuelto'].includes(pqr.status)) ||
                                                (i === 2 && ['En Proceso', 'Resuelto'].includes(pqr.status)) ||
                                                (i === 3 && pqr.status === 'Resuelto')
                                                ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                                            }`}>
                                                {((i === 0) || 
                                                (i === 1 && ['En Revisión', 'En Proceso', 'Resuelto'].includes(pqr.status)) ||
                                                (i === 2 && ['En Proceso', 'Resuelto'].includes(pqr.status)) ||
                                                (i === 3 && pqr.status === 'Resuelto')) && (
                                                    <span className="material-symbols-outlined text-black text-[10px] font-black">check</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/20 p-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Espera: {pqr.responseTime}</p>
                                    </div>
                                    <button className="text-primary text-[10px] font-black uppercase flex items-center gap-1">
                                        Detalles <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                            <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
                            <p className="text-sm font-bold uppercase tracking-widest">No hay registros</p>
                        </div>
                    )}
                </div>
            </main>
            
            <nav className="fixed bottom-0 w-full z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-[#366348] pb-6 pt-2 max-w-md mx-auto">
                <div className="flex justify-around items-center">
                    <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">home</span>
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

export default RequestsScreen;
