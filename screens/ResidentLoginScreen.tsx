
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ResidentLoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // DEMO MODE: Acepta cualquier usuario y clave
        setTimeout(() => {
            // Intentamos recuperar si existe un usuario real para mantener coherencia en el nombre si se registró
            const storedUserStr = localStorage.getItem('resident_user');
            const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

            // Si no hay nada en storage, creamos una sesión temporal demo
            if (!storedUser) {
                const demoUser = { 
                    username: username || 'demo_user', 
                    name: 'Residente', 
                    lastname: 'Demo', 
                    unitCode: '402-B',
                    email: username.includes('@') ? username : 'demo@puertoazul.com'
                };
                localStorage.setItem('resident_user', JSON.stringify(demoUser));
            }

            // Lógica de redirección basada en el input (si pone el correo del admin, va a panel admin)
            const inputLower = username.toLowerCase();
            if (inputLower === 'kassemnayib@yahoo.com' || inputLower === 'admin') {
                navigate('/admin/panel');
            } else {
                navigate('/home');
            }
        }, 800);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark p-6">
            <header className="absolute top-6 left-6">
                <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </header>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido</h1>
                    <p className="text-gray-500 dark:text-gray-400">Ingresa con cualquier usuario y clave para pruebas.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Usuario / Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">person</span>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all"
                                placeholder="Cualquier usuario funciona..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Clave</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">lock</span>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all tracking-widest"
                                placeholder="•••••"
                            />
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-[10px] text-primary font-black uppercase text-center tracking-widest">
                            Modo Desarrollador Activo: Credenciales Libres
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] mt-2 flex justify-center items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Ingresar
                                <span className="material-symbols-outlined filled">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">¿Deseas crear un perfil real?</p>
                    <Link to="/resident/register" className="text-primary font-bold hover:underline">
                        Regístrate como Propietario
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResidentLoginScreen;
