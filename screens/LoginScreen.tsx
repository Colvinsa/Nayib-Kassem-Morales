
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // DEMO MODE: Cualquier credencial es válida
        setTimeout(() => {
            navigate('/admin/panel');
        }, 600);
    };

    const handleForgotPassword = () => {
        const email = "kassemnayib@yahoo.com";
        const subject = encodeURIComponent('Recordación de Clave Prototipo');
        window.location.href = `mailto:${email}?subject=${subject}`;
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-sm animate-fade-in">
                <div className="flex flex-col items-center mb-10">
                    <div className="size-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary">
                        <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso Administrativo</h1>
                    <p className="text-gray-500 text-sm">Acceso libre para pruebas de prototipo</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Usuario Admin</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-4 outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all"
                            placeholder="Cualquier usuario..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-4 outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">Inicia sesión con cualquier dato</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            'Acceder al Panel'
                        )}
                    </button>
                </form>
                
                <div className="mt-6 flex flex-col gap-4 text-center">
                    <button 
                        onClick={handleForgotPassword}
                        className="text-sm text-primary font-bold hover:underline"
                    >
                        ¿Problemas de acceso?
                    </button>
                    
                    <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
