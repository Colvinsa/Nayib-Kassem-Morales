
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const AdminPanelScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-28 transition-colors">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div className="text-left">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Panel Administrativo</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sesión Activa • Puerto Azul</p>
                    </div>
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 gap-4 overflow-y-auto no-scrollbar">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col gap-2 text-left">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hola, Admin</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Selecciona una opción para gestionar la copropiedad y responder solicitudes.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/admin/pqr', { state: { returnTo: '/admin/panel' } })} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group relative">
                        <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Gestión PQR</span>
                        <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full"></span>
                    </button>

                    <button onClick={() => navigate('/admin/financials')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">monitoring</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">G. Financiera</span>
                    </button>

                    <button onClick={() => navigate('/admin/payments')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Cartera</span>
                    </button>

                    <button onClick={() => navigate('/admin/resources')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">energy_savings_leaf</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Recursos</span>
                    </button>

                    <button onClick={() => navigate('/gatekeeper')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">contact_page</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Directorio</span>
                    </button>

                    <button onClick={() => navigate('/admin/notices')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Comunicados</span>
                    </button>

                     <button onClick={() => navigate('/generate-qr', { state: { returnTo: '/admin/panel' } })} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">qr_code_2</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Accesos</span>
                    </button>
                </div>
            </main>

            <div className="fixed bottom-8 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none">
                <nav className="pointer-events-auto bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 flex items-center justify-between w-full max-w-[300px] transition-colors">
                    <button 
                        onClick={() => navigate('/home')}
                        className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-gray-300 group"
                    >
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">home</span>
                        <span className="text-[10px] font-bold">Ir al Home</span>
                    </button>
                    <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>
                    <button 
                        onClick={handleLogout}
                        className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 group"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-[10px] font-bold">Cerrar Sesión</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};
export default AdminPanelScreen;
