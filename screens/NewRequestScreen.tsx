import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PQRCategory {
    id: string;
    label: string;
    icon: string;
    color: string;
    priority: 'Alta' | 'Media' | 'Normal';
    responseTime: string;
}

const PQR_CATEGORIES: PQRCategory[] = [
    { id: 'estado_cuenta', label: 'Estado de Cuenta', icon: 'receipt_long', color: 'text-blue-500', priority: 'Normal', responseTime: '2-3 días hábiles' },
    { id: 'ruido', label: 'Ruido Excesivo', icon: 'volume_up', color: 'text-red-500', priority: 'Alta', responseTime: 'Menos de 8 horas' },
    { id: 'olores', label: 'Malos Olores', icon: 'airway', color: 'text-green-600', priority: 'Media', responseTime: 'Máximo 24 horas' },
    { id: 'mascotas', label: 'Limpieza Mascotas', icon: 'pets', color: 'text-amber-700', priority: 'Media', responseTime: 'Máximo 24 horas' },
    { id: 'parqueadero', label: 'Invasión Parqueadero', icon: 'local_parking', color: 'text-purple-600', priority: 'Alta', responseTime: 'Menos de 4 horas' },
    { id: 'fachadas', label: 'Cambio de Fachadas', icon: 'house_siding', color: 'text-indigo-600', priority: 'Normal', responseTime: '8-10 días hábiles' },
    { id: 'angeos', label: 'Colocación de Angeos', icon: 'grid_view', color: 'text-cyan-600', priority: 'Normal', responseTime: '5 días hábiles' },
    { id: 'comercio_otros', label: 'Comercio / Otros', icon: 'shopping_basket', color: 'text-orange-600', priority: 'Normal', responseTime: '48-72 horas' },
];

const NewRequestScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState<{ ticketId: string, category: PQRCategory } | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('resident_user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        } else {
            // Usuario demo si no hay login real
            setCurrentUser({ username: 'carlos', name: 'Carlos', lastname: 'Ruiz', unitCode: '402-B' });
        }
    }, []);

    const handleSend = () => {
        if (!selectedCategory || !description || !currentUser) return;
        setIsSubmitting(true);
        
        const categoryObj = PQR_CATEGORIES.find(c => c.id === selectedCategory)!;
        const generatedTicket = `PQR-${Math.floor(100000 + Math.random() * 900000)}`;

        setTimeout(() => {
            const newPqr = {
                id: Date.now().toString(),
                ticketId: generatedTicket,
                resident: `${currentUser.name} ${currentUser.lastname}`,
                username: currentUser.username, // Clave para filtrar en RequestsScreen
                unit: currentUser.unitCode,
                type: categoryObj.label,
                subject: subject || categoryObj.label,
                description,
                date: new Date().toISOString(),
                status: 'Pendiente',
                priority: categoryObj.priority,
                responseTime: categoryObj.responseTime
            };
            
            // Guardar en la base de datos global de PQRs
            const existing = JSON.parse(localStorage.getItem('admin_pqrs') || '[]');
            localStorage.setItem('admin_pqrs', JSON.stringify([newPqr, ...existing]));
            
            setIsSubmitting(false);
            setSubmittedData({ ticketId: generatedTicket, category: categoryObj });
        }, 1200);
    };

    if (submittedData) {
        return (
            <div className="flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark animate-fade-in items-center justify-center p-6 text-center">
                <div className="size-24 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-glow border border-primary/20">
                    <span className="material-symbols-outlined text-5xl filled">check_circle</span>
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">¡Solicitud Recibida!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs font-medium text-left mx-auto">
                    Su queja ha sido radicada exitosamente en el sistema de la Administración de Puerto Azul.
                </p>

                <div className="w-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4 mb-8">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Número de Radicado</p>
                        <p className="text-2xl font-black text-primary font-mono">{submittedData.ticketId}</p>
                    </div>
                    
                    <div className="h-px bg-gray-100 dark:bg-white/5 w-full"></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Urgencia</p>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider 
                                ${submittedData.category.priority === 'Alta' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                  submittedData.category.priority === 'Media' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                                  'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                {submittedData.category.priority}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tiempo de Respuesta</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-gray-200">{submittedData.category.responseTime}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 w-full">
                    <button 
                        onClick={() => navigate('/home')}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl shadow-xl text-sm uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Volver al Inicio
                    </button>
                    <button 
                        onClick={() => navigate('/requests')}
                        className="w-full bg-transparent text-gray-500 dark:text-gray-400 font-bold py-2 text-xs uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        Seguir trazabilidad en mis solicitudes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 border-b border-gray-200 dark:border-white/5 transition-colors">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all text-gray-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-gray-900 dark:text-white">Radicar PQR</h2>
                <button onClick={() => navigate('/home')} className="flex h-10 items-center justify-center px-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all">
                    <p className="text-gray-500 dark:text-[#95c6a9] text-sm font-bold leading-normal tracking-wide">Salir</p>
                </button>
            </header>
            
            <main className="flex-1 px-4 py-6 pb-32 space-y-8 overflow-y-auto no-scrollbar">
                <section>
                    <h2 className="text-2xl font-black leading-tight tracking-tight mb-2 px-1 text-gray-900 dark:text-white text-left">Nueva Solicitud</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest px-1 mb-6 text-left">Selecciona la categoría de tu reporte</p>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {PQR_CATEGORIES.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setSubject('');
                                }}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center aspect-square ${selectedCategory === cat.id ? 'bg-primary border-primary shadow-glow scale-105 z-10' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5 shadow-sm'}`}
                            >
                                <span className={`material-symbols-outlined text-2xl mb-2 ${selectedCategory === cat.id ? 'text-black' : cat.color}`}>{cat.icon}</span>
                                <span className={`text-[9px] font-black leading-tight uppercase tracking-tighter ${selectedCategory === cat.id ? 'text-black' : 'text-gray-600 dark:text-gray-400'}`}>{cat.label}</span>
                                {selectedCategory === cat.id && (
                                    <div className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[7px] px-2 py-0.5 rounded-full font-black uppercase">
                                        {cat.priority}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={`space-y-6 transition-all duration-300 ${selectedCategory ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {selectedCategory === 'comercio_otros' && (
                        <div className="flex flex-col gap-2 text-left animate-slide-up">
                            <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest ml-1">Especifique el Asunto</label>
                            <input 
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full rounded-2xl bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-primary text-gray-900 dark:text-white h-14 px-4 text-sm font-bold outline-none" 
                                placeholder="Ej: Venta de Helados / Otros..." 
                                type="text"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2 text-left">
                        <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest ml-1">Descripción Detallada</label>
                        <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full rounded-2xl bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-primary text-gray-900 dark:text-white min-h-[140px] p-4 text-sm font-medium resize-none outline-none leading-relaxed" 
                            placeholder="Describa los hechos, fechas y detalles relevantes para la administración..."
                        ></textarea>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Evidencia Fotográfica</h3>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Opcional</span>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 h-20 rounded-2xl bg-white dark:bg-surface-dark border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">photo_camera</span>
                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Cámara</span>
                            </button>
                            <button className="flex-1 h-20 rounded-2xl bg-white dark:bg-surface-dark border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">image</span>
                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Galería</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-40 max-w-md mx-auto">
                <button 
                    disabled={!selectedCategory || !description || isSubmitting}
                    onClick={handleSend}
                    className="w-full bg-primary disabled:opacity-20 text-black font-black text-sm uppercase tracking-[0.2em] rounded-3xl h-16 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {isSubmitting ? (
                        <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>Enviar a Administración</span>
                            <span className="material-symbols-outlined filled">send</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default NewRequestScreen;