import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Tipos de datos para PQR
interface PQR {
    id: string;
    ticketId: string;
    resident: string;
    unit: string;
    avatar: string;
    type: 'Petición' | 'Queja' | 'Reclamo';
    subject: string;
    description: string;
    date: string;
    status: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Remitido';
    referral: 'Ninguno' | 'Mantenimiento' | 'Consejo' | 'Convivencia';
    adminResponse?: string;
    attachments?: string[];
}

// Datos simulados (Mock Data)
const MOCK_PQRS: PQR[] = [
    {
        id: '1',
        ticketId: '#PQR-850',
        resident: 'Carlos Ruiz',
        unit: '402-B',
        avatar: 'https://i.pravatar.cc/150?u=carlos',
        type: 'Reclamo',
        subject: 'Filtración de agua techo baño',
        description: 'Desde hace 3 días tengo una gotera constante en el baño principal. Parece venir del piso de arriba. Adjunto fotos del daño en la pintura.',
        date: '2023-10-25T09:30:00',
        status: 'Pendiente',
        referral: 'Ninguno',
        attachments: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200&h=200',
            'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=200&h=200'
        ]
    },
    {
        id: '2',
        ticketId: '#PQR-849',
        resident: 'Ana Gomez',
        unit: '501-A',
        avatar: 'https://i.pravatar.cc/150?u=ana',
        type: 'Queja',
        subject: 'Ruido excesivo vecinos',
        description: 'El apartamento 502 tuvo música alta hasta las 3 AM el sábado pasado. Solicito intervención del comité de convivencia.',
        date: '2023-10-24T14:15:00',
        status: 'En Proceso',
        referral: 'Convivencia',
        adminResponse: 'Se ha enviado notificación escrita al apartamento 502.',
    },
    {
        id: '3',
        ticketId: '#PQR-848',
        resident: 'Juan Perez',
        unit: '101-C',
        avatar: 'https://i.pravatar.cc/150?u=juan',
        type: 'Petición',
        subject: 'Solicitud alquiler salón social',
        description: 'Quisiera saber si el salón está disponible para el 15 de Noviembre para un cumpleaños infantil.',
        date: '2023-10-23T10:00:00',
        status: 'Resuelto',
        referral: 'Ninguno',
        adminResponse: 'Hola Juan, sí está disponible. Puedes reservar desde la app en la sección Reservas.',
    }
];

const AdminPQRScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Estados de Vista
    const [selectedPQR, setSelectedPQR] = useState<PQR | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('Todos');

    // Estados del Formulario de Gestión
    const [responseText, setResponseText] = useState('');
    const [referralAction, setReferralAction] = useState<string>('Ninguno');
    const [newStatus, setNewStatus] = useState<string>('Pendiente');

    const handleBack = () => {
        if (selectedPQR) {
            setSelectedPQR(null); // Volver a la lista
        } else {
            // Volver al panel admin o home
            const returnPath = (location.state as any)?.returnTo || '/admin/panel';
            navigate(returnPath);
        }
    };

    const handleSelectPQR = (pqr: PQR) => {
        setSelectedPQR(pqr);
        setResponseText(pqr.adminResponse || '');
        setReferralAction(pqr.referral);
        setNewStatus(pqr.status);
    };

    const handleSaveManagement = () => {
        // Aquí iría la lógica para guardar en backend
        alert(`Gestión Guardada para ${selectedPQR?.ticketId}:\nEstado: ${newStatus}\nRemitido a: ${referralAction}\nRespuesta: ${responseText}`);
        setSelectedPQR(null);
    };

    // Filtros
    const filteredPQRs = filterStatus === 'Todos' 
        ? MOCK_PQRS 
        : MOCK_PQRS.filter(p => p.status === filterStatus);

    // KPIs Calculados
    const kpiPending = MOCK_PQRS.filter(p => p.status === 'Pendiente').length;
    const kpiProcess = MOCK_PQRS.filter(p => p.status === 'En Proceso').length;
    const kpiResolved = MOCK_PQRS.filter(p => p.status === 'Resuelto').length;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-6">
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={handleBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                        {selectedPQR ? `Gestionando ${selectedPQR.ticketId}` : 'Centro de Control PQR'}
                    </h1>
                    <div className="size-10 flex items-center justify-center">
                        {!selectedPQR && <span className="material-symbols-outlined text-gray-400">filter_list</span>}
                    </div>
                </div>
            </header>
            
            <main className="flex-1 flex flex-col p-4 space-y-6">
                
                {/* VISTA DE LISTA (DASHBOARD) */}
                {!selectedPQR && (
                    <>
                        {/* KPI Cards */}
                        <section className="grid grid-cols-3 gap-3 animate-fade-in">
                            <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Pendientes</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpiPending}</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">En Gestión</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpiProcess}</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Resueltas</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpiResolved}</p>
                            </div>
                        </section>

                        {/* Listado */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Buzón de Entrada</h3>
                                <div className="flex gap-2">
                                    {['Todos', 'Pendiente'].map(filter => (
                                        <button 
                                            key={filter}
                                            onClick={() => setFilterStatus(filter)}
                                            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${filterStatus === filter ? 'bg-slate-900 dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {filteredPQRs.map((pqr) => (
                                    <button 
                                        key={pqr.id}
                                        onClick={() => handleSelectPQR(pqr)}
                                        className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all text-left active:scale-[0.99]"
                                    >
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <img src={pqr.avatar} alt={pqr.resident} className="size-10 rounded-full border border-gray-100 dark:border-white/10" />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pqr.resident}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Torre {pqr.unit}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                    ${pqr.status === 'Pendiente' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 
                                                      pqr.status === 'Resuelto' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                                      'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                                    {pqr.status}
                                                </span>
                                                <span className="text-[10px] text-gray-400 mt-1">{new Date(pqr.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pl-[52px]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`size-2 rounded-full 
                                                    ${pqr.type === 'Queja' ? 'bg-red-500' : pqr.type === 'Reclamo' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                                                </span>
                                                <p className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase">{pqr.type}</p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{pqr.subject}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{pqr.description}</p>
                                        </div>

                                        {pqr.referral !== 'Ninguno' && (
                                            <div className="ml-[52px] mt-1 inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md self-start">
                                                <span className="material-symbols-outlined text-[12px]">forward</span>
                                                Remitido a: <span className="font-bold text-slate-600 dark:text-gray-300">{pqr.referral}</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                                
                                {filteredPQRs.length === 0 && (
                                    <div className="py-10 text-center opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                        <p className="text-sm">No hay solicitudes en este estado.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* VISTA DE DETALLE Y GESTIÓN */}
                {selectedPQR && (
                    <div className="animate-slide-up space-y-6 pb-20">
                        {/* Info Residente y Solicitud */}
                        <section className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <img src={selectedPQR.avatar} alt={selectedPQR.resident} className="size-12 rounded-full border-2 border-primary/20" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{selectedPQR.resident}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">Torre {selectedPQR.unit}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(selectedPQR.date).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{selectedPQR.type}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{selectedPQR.ticketId}</span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{selectedPQR.subject}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-black/20 p-3 rounded-xl">
                                    {selectedPQR.description}
                                </p>
                            </div>

                            {/* Evidencias / Adjuntos */}
                            {selectedPQR.attachments && selectedPQR.attachments.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Evidencias Adjuntas</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {selectedPQR.attachments.map((url, idx) => (
                                            <img key={idx} src={url} alt="Evidencia" className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer hover:opacity-80 transition-opacity" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* PANEL DE GESTIÓN ADMINISTRATIVA */}
                        <section className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-primary/10 space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Gestión Administrativa</h3>
                            </div>

                            {/* Clasificación / Remisión */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Clasificar / Remitir caso a:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Ninguno', 'Mantenimiento', 'Consejo', 'Convivencia'].map((area) => (
                                        <button 
                                            key={area}
                                            onClick={() => setReferralAction(area)}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2
                                                ${referralAction === area 
                                                    ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-black dark:border-white' 
                                                    : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'}`}
                                        >
                                            {area === 'Mantenimiento' && <span className="material-symbols-outlined text-[14px]">build</span>}
                                            {area === 'Consejo' && <span className="material-symbols-outlined text-[14px]">gavel</span>}
                                            {area === 'Convivencia' && <span className="material-symbols-outlined text-[14px]">diversity_3</span>}
                                            {area}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Respuesta */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Respuesta al Propietario</label>
                                <textarea 
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Escribe la respuesta oficial o las acciones tomadas..."
                                    className="w-full min-h-[100px] rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                                ></textarea>
                            </div>

                            {/* Cambio de Estado */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Estado del Ticket</label>
                                <select 
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Remitido">Remitido a Comité</option>
                                    <option value="Resuelto">Resuelto / Cerrado</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleSaveManagement}
                                className="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <span className="material-symbols-outlined filled">save</span>
                                Guardar y Notificar
                            </button>
                        </section>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminPQRScreen;