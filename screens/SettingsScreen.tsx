
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('resident_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Demo fallback
            setUser({ name: 'Carlos', lastname: 'Ruiz', unitCode: '402-B', username: 'carlos', email: 'carlos.ruiz@email.com' });
        }
    }, []);

    const handleLogout = () => {
        if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
            navigate('/');
        }
    };

    const handleSecurity = () => {
        alert("Función para cambiar clave alfanumérica de 5 caracteres habilitada en próxima versión.");
    };

    const handleOpenManual = () => {
        window.open('https://pdfobject.com/pdf/sample.pdf', '_blank');
    };

    const sendEmail = (to: string, subject: string) => {
        const body = encodeURIComponent(`Residente: ${user?.name} ${user?.lastname}\nUnidad: ${user?.unitCode}\n\nEscriba su mensaje aquí...`);
        window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors overflow-x-hidden pb-32">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Ajustes y Perfil</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 p-6 space-y-8">
                {/* Perfil Card */}
                <section className="flex flex-col items-center text-center animate-fade-in">
                    <div className="relative mb-4">
                        <div className="size-24 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center text-primary shadow-lg">
                            <span className="material-symbols-outlined text-5xl">account_circle</span>
                        </div>
                        <button className="absolute bottom-0 right-0 size-8 bg-primary rounded-full border-4 border-background-light dark:border-background-dark flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-sm font-bold">edit</span>
                        </button>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{user?.name} {user?.lastname}</h2>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-1">Unidad {user?.unitCode} • Puerto Azul</p>
                </section>

                <div className="space-y-6">
                    {/* Sección 1: Cuenta */}
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] ml-1">Mi Cuenta</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <button onClick={handleSecurity} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Cambiar Contraseña</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Clave de 5 caracteres</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                            <div className="h-px bg-gray-50 dark:bg-white/5 mx-4"></div>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">contact_mail</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Datos de Contacto</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{user?.email}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Sección 2: Canales de Comunicación */}
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] ml-1">Comunicación Oficial</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => sendEmail('administracion@puertoazul.com', 'Consulta a Administración')}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">manager</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Administración</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black">Enviar Correo Directo</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">mail</span>
                            </button>
                            <div className="h-px bg-gray-50 dark:bg-white/5 mx-4"></div>
                            <button 
                                onClick={() => sendEmail('consejo@puertoazul.com', 'Mensaje para el Consejo de Administración')}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">gavel</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Consejo de Admón.</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black">Asuntos Normativos</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">mail</span>
                            </button>
                            <div className="h-px bg-gray-50 dark:bg-white/5 mx-4"></div>
                            <button 
                                onClick={() => sendEmail('revisoria@puertoazul.com', 'Reporte para Revisoría Fiscal')}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">account_balance</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Revisoría Fiscal</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black">Control Financiero</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">mail</span>
                            </button>
                        </div>
                    </section>

                    {/* Sección 3: Preferencias App */}
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] ml-1">Aplicación</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">dark_mode</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Modo Nocturno</p>
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>
                    </section>

                    {/* Cerrar Sesión */}
                    <button 
                        onClick={handleLogout}
                        className="w-full mt-4 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                        <span className="material-symbols-outlined font-black">logout</span>
                        <span className="text-sm font-black uppercase tracking-widest">Cerrar Sesión</span>
                    </button>
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
                    <button className="flex flex-col items-center gap-1 p-2 text-primary">
                        <span className="material-symbols-outlined filled">settings</span>
                        <span className="text-[9px] font-black uppercase">Ajustes</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default SettingsScreen;
