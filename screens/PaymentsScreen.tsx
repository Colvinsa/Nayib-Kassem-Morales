import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'solvent' | 'insolvent'>('solvent');

    useEffect(() => {
        // Lee el estado simulado que carga el Admin desde el archivo de Cartera
        const stored = localStorage.getItem('unit_status_B_402');
        if (stored) {
            setStatus(stored as 'solvent' | 'insolvent');
        }
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                 <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Estado de Cartera</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 pb-32">
                <div className={`size-56 rounded-full flex items-center justify-center mb-8 animate-fade-in transition-all duration-500 ${status === 'solvent' ? 'bg-green-100 dark:bg-green-500/20 text-green-500 shadow-[0_0_60px_-15px_rgba(34,197,94,0.5)]' : 'bg-red-100 dark:bg-red-500/20 text-red-500 shadow-[0_0_60px_-15px_rgba(239,68,68,0.5)]'}`}>
                    <span className="material-symbols-outlined text-[120px]">
                        {status === 'solvent' ? 'verified' : 'gpp_bad'}
                    </span>
                </div>
                
                <h2 className={`text-4xl font-black mb-4 text-center tracking-tight ${status === 'solvent' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {status === 'solvent' ? 'PAZ Y SALVO' : 'EN MORA'}
                </h2>
                
                <p className="text-slate-600 dark:text-gray-300 text-center max-w-sm text-lg font-medium leading-relaxed">
                    {status === 'solvent' 
                        ? 'Estás al día con la administración. ¡Gracias por tu puntualidad!' 
                        : 'Presentas saldos pendientes. Por favor acércate a la oficina de administración.'}
                </p>

                <div className="mt-16 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 max-w-xs w-full flex items-start gap-3">
                     <span className="material-symbols-outlined text-gray-400 shrink-0">info</span>
                     <p className="text-xs text-gray-500 dark:text-gray-400 text-left leading-relaxed">
                        Esta información depende del último archivo de "Cartera" cargado por la administración.
                     </p>
                </div>
            </main>
        </div>
    );
};

export default PaymentsScreen;