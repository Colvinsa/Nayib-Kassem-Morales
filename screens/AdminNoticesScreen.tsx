import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Notice {
    id: number;
    title: string;
    description: string;
    type: 'maintenance' | 'water' | 'electricity' | 'info' | 'emergency';
    date: string;
}

const AdminNoticesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState<Notice[]>([]);
    
    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('maintenance');

    useEffect(() => {
        const storedNotices = localStorage.getItem('community_notices');
        if (storedNotices) {
            setNotices(JSON.parse(storedNotices));
        } else {
            // Initial Seed Data if empty
            const seed: Notice[] = [
                { id: 1, title: 'Mantenimiento de Piscina', description: 'Cierre por mantenimiento preventivo el martes.', type: 'maintenance', date: new Date().toISOString() }
            ];
            setNotices(seed);
            localStorage.setItem('community_notices', JSON.stringify(seed));
        }
    }, []);

    const handleSave = () => {
        if (!title || !description) return;

        const newNotice: Notice = {
            id: Date.now(),
            title,
            description,
            type: type as any,
            date: new Date().toISOString()
        };

        const updatedNotices = [newNotice, ...notices];
        setNotices(updatedNotices);
        localStorage.setItem('community_notices', JSON.stringify(updatedNotices));

        // Reset form
        setTitle('');
        setDescription('');
        setType('maintenance');
    };

    const handleDelete = (id: number) => {
        const updatedNotices = notices.filter(n => n.id !== id);
        setNotices(updatedNotices);
        localStorage.setItem('community_notices', JSON.stringify(updatedNotices));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'water': return 'water_drop';
            case 'electricity': return 'bolt';
            case 'emergency': return 'warning';
            case 'info': return 'info';
            default: return 'build'; // maintenance
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-20">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                 <button onClick={() => navigate('/admin/panel')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-black/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gestión de Novedades</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 p-6 space-y-8">
                {/* Creation Form */}
                <section className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">campaign</span>
                        Publicar Nuevo Aviso
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tipo de Novedad</label>
                            <div className="grid grid-cols-5 gap-2 mt-1">
                                {[
                                    { id: 'maintenance', icon: 'build', label: 'Mnt.' },
                                    { id: 'water', icon: 'water_drop', label: 'Agua' },
                                    { id: 'electricity', icon: 'bolt', label: 'Luz' },
                                    { id: 'info', icon: 'info', label: 'Info' },
                                    { id: 'emergency', icon: 'warning', label: 'Urg.' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${type === t.id ? 'bg-primary text-black border-primary' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-transparent hover:bg-gray-100'}`}
                                    >
                                        <span className="material-symbols-outlined text-xl">{t.icon}</span>
                                        <span className="text-[10px] font-bold mt-1">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej. Corte de Agua Programado"
                                className="w-full mt-1 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descripción</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalles de la novedad..."
                                rows={3}
                                className="w-full mt-1 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={!title || !description}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Publicar Aviso</span>
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </section>

                {/* List of Active Notices */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Avisos Activos</h3>
                    <div className="space-y-3">
                        {notices.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-8">No hay avisos publicados.</p>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice.id} className="group relative flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-200 dark:border-white/5 items-start">
                                    <div className={`shrink-0 size-10 rounded-full flex items-center justify-center 
                                        ${notice.type === 'emergency' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                                          notice.type === 'water' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                          notice.type === 'electricity' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                          'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{getTypeIcon(notice.type)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{notice.title}</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notice.description}</p>
                                        <p className="text-[10px] text-gray-400 mt-2 font-mono">{new Date(notice.date).toLocaleDateString()} {new Date(notice.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(notice.id)}
                                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminNoticesScreen;