import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LandingScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden transition-colors">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/40 to-transparent dark:from-background-dark dark:via-background-dark/80 dark:to-transparent z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop" 
                    alt="Puerto Azul Background" 
                    className="w-full h-full object-cover opacity-30 dark:opacity-60"
                />
            </div>

            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle className="!bg-white dark:!bg-white/10 shadow-lg" />
            </div>

            <main className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12 gap-8 text-left">
                <div className="flex flex-col gap-2">
                    <div className="size-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary mb-4 border border-primary/20">
                        <span className="material-symbols-outlined text-4xl">apartment</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        Puerto Azul <br/>
                        <span className="text-primary">Club House</span>
                    </h1>
                    <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xs font-medium">
                        Gestión inteligente para tu hogar y comunidad.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => navigate('/resident/login')}
                        className="group w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between px-6"
                    >
                        <span>Soy Residente</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>

                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-lg py-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/20 transition-all flex items-center justify-between px-6"
                    >
                        <span>Administración / Portería</span>
                        <span className="material-symbols-outlined text-slate-400 dark:text-white/50">admin_panel_settings</span>
                    </button>
                </div>

                <p className="text-center text-slate-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest mt-4">
                    v2.0.2 • Puerto Azul Smart App
                </p>
            </main>
        </div>
    );
};

export default LandingScreen;