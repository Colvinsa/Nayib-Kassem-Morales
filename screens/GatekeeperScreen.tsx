import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

interface AuthorizedPerson {
    name: string;
    idType: 'Cédula' | 'Pasaporte' | 'Registro Civil' | 'Otro';
    idNumber: string;
}

interface OwnerRecord {
    id: string;
    torre: string;
    apto: string;
    name: string;
    lastname: string;
    email: string;
    tel1: string;
    tel2: string;
    authorized?: AuthorizedPerson[];
}

const DEFAULT_DB: OwnerRecord[] = [
    { id: '1', torre: 'A', apto: '101', name: 'Maria', lastname: 'Rodriguez', email: 'maria.rodriguez@email.com', tel1: '573001234567', tel2: '', authorized: [{ name: 'Juan Rodriguez', idType: 'Cédula', idNumber: '102030' }] },
    { id: '2', torre: 'B', apto: '402', name: 'Carlos', lastname: 'Ruiz', email: 'carlos.ruiz@email.com', tel1: '573005551234', tel2: '', authorized: [{ name: 'Elena Ruiz', idType: 'Pasaporte', idNumber: 'G998877' }] },
    { id: '3', torre: '3', apto: '102', name: 'Juan', lastname: 'Perez', email: 'propietario@test.com', tel1: '3000000000', tel2: '' }
];

const SERVICE_CATEGORIES = [
    { label: "Gas", icon: "propane_tank" },
    { label: "Internet", icon: "router" },
    { label: "Cerrajero", icon: "vpn_key" },
    { label: "Plomero", icon: "plumbing" },
    { label: "Domicilio", icon: "delivery_dining" },
    { label: "Téc. Aires", icon: "ac_unit" },
    { label: "Eléctrico", icon: "bolt" },
    { label: "Limpieza", icon: "cleaning_services" },
    { label: "Otros", icon: "more_horiz" }
];

const SignaturePad: React.FC<{ onSave: (data: string) => void }> = ({ onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: any) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) onSave(canvas.toDataURL());
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#36e27b';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            onSave('');
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest">Firma de Conformidad</label>
                <button type="button" onClick={clear} className="text-[10px] text-primary font-bold uppercase hover:opacity-70">Limpiar</button>
            </div>
            <canvas 
                ref={canvasRef}
                width={340}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl cursor-crosshair touch-none"
            />
        </div>
    );
};

const GatekeeperScreen: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [flowMode, setFlowMode] = useState<'visitor' | 'service' | 'notify' | null>(null);
    const [selectedResident, setSelectedResident] = useState<OwnerRecord | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [residents, setResidents] = useState<OwnerRecord[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const [visitorForm, setVisitorForm] = useState({ name: '', lastname: '', idNumber: '', habeasData: false, signature: '' });
    const [serviceForm, setServiceForm] = useState({ 
        category: '', 
        name: '', 
        lastname: '', 
        idNumber: '', 
        provider: '', 
        hasPhoto: false, 
        habeasData: false, 
        signature: '' 
    });

    useEffect(() => {
        const stored = localStorage.getItem('community_owners_db');
        if (stored) {
            setResidents(JSON.parse(stored));
        } else {
            setResidents(DEFAULT_DB);
            localStorage.setItem('community_owners_db', JSON.stringify(DEFAULT_DB));
        }
    }, []);

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsImporting(true);
        
        // Simulación de procesamiento y guardado permanente
        setTimeout(() => {
            const mockNewRecord: OwnerRecord = { 
                id: Date.now().toString(), 
                torre: 'C', apto: '205', 
                name: 'Fernando', lastname: 'Alonso', 
                email: 'f1@email.com', tel1: '3109988776', tel2: '',
                authorized: [
                    { name: 'Flavio Briatore', idType: 'Pasaporte', idNumber: 'EU-998877' }
                ]
            };
            
            const updatedList = [...residents, mockNewRecord];
            setResidents(updatedList);
            localStorage.setItem('community_owners_db', JSON.stringify(updatedList));
            
            setIsImporting(false);
            alert("Los nuevos datos han sido guardados permanentemente en el sistema.");
        }, 1200);
    };

    const handleSelectResident = (resident: OwnerRecord) => {
        setSelectedResident(resident);
    };

    const handleSendWhatsApp = (resident: OwnerRecord, type: string) => {
        const phone = resident.tel1.replace(/\D/g, '');
        const msg = `*Puerto Azul Club House*\n\nHola ${resident.name}, informamos el ingreso de un *${type}* a su unidad.\nFecha: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        closeAll();
    };

    const closeAll = () => {
        setFlowMode(null);
        setSelectedResident(null);
        setIsScannerOpen(false);
        setSearchQuery('');
        setVisitorForm({ name: '', lastname: '', idNumber: '', habeasData: false, signature: '' });
        setServiceForm({ category: '', name: '', lastname: '', idNumber: '', provider: '', hasPhoto: false, habeasData: false, signature: '' });
    };

    // Lógica de búsqueda exclusiva: Si no hay texto, no hay resultados
    const filteredResidents = searchQuery.trim().length > 0 
        ? residents.filter(r => 
            `${r.torre}${r.apto}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col pb-32 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display transition-colors overflow-x-hidden">
            <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                    <div className="text-primary flex bg-primary/10 rounded-full w-10 h-10 items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Puerto Azul</h2>
                        <p className="text-gray-500 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">Seguridad Portería</p>
                    </div>
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
                <section>
                    <button onClick={() => setIsScannerOpen(true)} className="w-full h-32 rounded-3xl bg-primary shadow-glow flex flex-col items-center justify-center text-black active:scale-[0.97] transition-all group relative overflow-hidden">
                        <span className="material-symbols-outlined text-5xl mb-1">qr_code_scanner</span>
                        <span className="text-sm font-black uppercase tracking-widest">Escanear Pase QR</span>
                    </button>
                </section>

                <section>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4 ml-1 text-left">Control de Entradas</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setFlowMode('visitor')} className="h-32 rounded-3xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-6 flex flex-col justify-between text-left shadow-sm active:scale-95 transition-all">
                            <div className="size-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Registrar<br/>Visita</p>
                        </button>
                        <button onClick={() => setFlowMode('service')} className="h-32 rounded-3xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-6 flex flex-col justify-between text-left shadow-sm active:scale-95 transition-all group">
                            <div className="size-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">home_repair_service</span>
                            </div>
                            <p className="text-sm font-black uppercase tracking-tight text-orange-600 dark:text-orange-500">Técnicos &<br/>Servicios</p>
                        </button>
                    </div>
                </section>

                <section>
                    <button onClick={() => setFlowMode('notify')} className="w-full h-20 rounded-2xl bg-white dark:bg-surface-highlight border border-gray-100 dark:border-white/10 flex items-center justify-between px-6 shadow-sm active:scale-[0.98] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                <span className="material-symbols-outlined">contact_page</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-slate-900 dark:text-white">Directorio de Residentes</p>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Base de Datos de Propietarios</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                    </button>
                </section>
            </main>

            {/* MODAL: SELECCIÓN DE UNIDAD (DIRECTORIO EXCLUSIVO POR BÚSQUEDA) */}
            {flowMode && !selectedResident && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeAll}></div>
                    <div className="relative w-full max-w-md h-[85vh] bg-white dark:bg-surface-dark rounded-t-[3rem] overflow-hidden flex flex-col animate-slide-up shadow-2xl">
                        <div className="p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-start text-left">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{flowMode === 'notify' ? 'Directorio' : 'Búsqueda de Destino'}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Escriba para visualizar residentes</p>
                            </div>
                            <div className="flex gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleImportExcel} accept=".xlsx,.xls" className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className={`size-10 rounded-full flex items-center justify-center transition-all ${isImporting ? 'bg-orange-500 animate-spin text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-black'}`} title="Guardar base de datos"><span className="material-symbols-outlined">{isImporting ? 'sync' : 'save'}</span></button>
                                <button onClick={closeAll} className="size-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-900 dark:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4 flex-1 overflow-y-auto no-scrollbar">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-4 text-gray-400">search</span>
                                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Busca Torre, Apto o Apellido..." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                            </div>
                            
                            <div className="space-y-3 pb-20">
                                {searchQuery.trim().length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                        <span className="material-symbols-outlined text-6xl mb-4">person_search</span>
                                        <p className="text-sm font-bold uppercase tracking-widest">Ingrese datos para buscar</p>
                                    </div>
                                ) : filteredResidents.length > 0 ? (
                                    filteredResidents.map(res => (
                                        <button key={res.id} onClick={() => handleSelectResident(res)} className="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between text-left transition-all hover:border-primary/50">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center font-black">
                                                    <span className="text-[9px] uppercase">{res.torre}</span>
                                                    <span className="text-base">{res.apto}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white leading-tight">{res.name} {res.lastname}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                                                        {res.authorized ? `${res.authorized.length} Autorizados` : 'Titular Único'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
                                        <p className="text-sm font-bold">No se encontraron resultados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: FORMULARIO VISITA */}
            {flowMode === 'visitor' && selectedResident && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeAll}></div>
                    <div className="relative w-full max-w-md bg-white dark:bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden animate-zoom-in text-left shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-blue-500/5">
                            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">Registrar Visita</h3>
                            <p className="text-xs text-blue-500 font-black uppercase tracking-widest mt-1">Destino: Torre {selectedResident.torre} - Apto {selectedResident.apto}</p>
                        </div>
                        <div className="p-8 space-y-5 overflow-y-auto no-scrollbar flex-1">
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Nombres" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white" onChange={e => setVisitorForm({...visitorForm, name: e.target.value})} />
                                <input placeholder="Apellidos" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white" onChange={e => setVisitorForm({...visitorForm, lastname: e.target.value})} />
                            </div>
                            <input placeholder="Cédula / Pasaporte" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white" onChange={e => setVisitorForm({...visitorForm, idNumber: e.target.value})} />
                            <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer">
                                <input type="checkbox" className="mt-1 size-5 rounded-md border-blue-500 text-blue-500 focus:ring-blue-500" checked={visitorForm.habeasData} onChange={e => setVisitorForm({...visitorForm, habeasData: e.target.checked})} />
                                <div className="text-[10px] text-gray-500 dark:text-white/40 leading-relaxed font-bold uppercase tracking-tighter">Acepto los términos de Habeas Data para el ingreso a la copropiedad.</div>
                            </label>
                            {visitorForm.habeasData && <SignaturePad onSave={data => setVisitorForm({...visitorForm, signature: data})} />}
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-white/5">
                            <button disabled={!visitorForm.signature || !visitorForm.name} onClick={() => handleSendWhatsApp(selectedResident, 'VISITANTE')} className="w-full bg-blue-500 disabled:opacity-30 text-white font-black py-4 rounded-3xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest">Confirmar Entrada</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: FORMULARIO SERVICIOS TÉCNICOS */}
            {flowMode === 'service' && selectedResident && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeAll}></div>
                    <div className="relative w-full max-w-md bg-white dark:bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden animate-zoom-in text-left shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-orange-500/5 flex justify-between items-start text-left">
                            <div>
                                <h3 className="text-2xl font-black text-orange-600 dark:text-orange-500">Técnicos & Otros</h3>
                                <p className="text-xs text-orange-500 font-black uppercase tracking-widest mt-1">Hacia: Apto {selectedResident.torre}{selectedResident.apto}</p>
                            </div>
                            <button onClick={closeAll} className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">1. Categoría de Servicio</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {SERVICE_CATEGORIES.map(cat => (
                                        <button key={cat.label} onClick={() => setServiceForm({...serviceForm, category: cat.label})} className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${serviceForm.category === cat.label ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500'}`}>
                                            <span className="material-symbols-outlined text-xl mb-1">{cat.icon}</span>
                                            <span className="text-[9px] font-black uppercase">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-left">2. Datos del Personal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="Nombres" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
                                    <input placeholder="Apellidos" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" onChange={e => setServiceForm({...serviceForm, lastname: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="ID / Documento" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" onChange={e => setServiceForm({...serviceForm, idNumber: e.target.value})} />
                                    <input placeholder="Empresa Prestadora" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" onChange={e => setServiceForm({...serviceForm, provider: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className={`size-14 rounded-xl flex items-center justify-center ${serviceForm.hasPhoto ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-2xl">{serviceForm.hasPhoto ? 'check' : 'photo_camera'}</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carnetización</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{serviceForm.hasPhoto ? 'Foto verificada' : 'Capturar foto de ID'}</p>
                                </div>
                                <button onClick={() => setServiceForm({...serviceForm, hasPhoto: true})} className="size-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">photo_camera</span></button>
                            </div>
                            <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer">
                                <input type="checkbox" className="mt-1 size-5 rounded-md border-orange-500 text-orange-500 focus:ring-orange-500" checked={serviceForm.habeasData} onChange={e => setServiceForm({...serviceForm, habeasData: e.target.checked})} />
                                <div className="text-[10px] text-gray-500 dark:text-white/40 font-bold uppercase tracking-tighter text-left">Certifico el cumplimiento de normas de seguridad y Habeas Data.</div>
                            </label>
                            {serviceForm.habeasData && <SignaturePad onSave={data => setServiceForm({...serviceForm, signature: data})} />}
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-white/5">
                            <button disabled={!serviceForm.signature || !serviceForm.category || !serviceForm.name} onClick={() => handleSendWhatsApp(selectedResident, `SERVICIO TÉCNICO: ${serviceForm.category.toUpperCase()}`)} className="w-full bg-orange-500 disabled:opacity-30 text-white font-black py-4 rounded-3xl shadow-xl shadow-orange-500/20 text-sm uppercase tracking-widest">Autorizar Servicio</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: INFO RESIDENTE Y AUTORIZADOS */}
            {flowMode === 'notify' && selectedResident && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedResident(null)}></div>
                    <div className="relative w-full max-w-md bg-white dark:bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden animate-zoom-in text-left shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-8 border-b border-gray-100 dark:border-white/10 bg-primary/5 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Información de Unidad</h3>
                                <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">Torre {selectedResident.torre} - Apartamento {selectedResident.apto}</p>
                            </div>
                            <button onClick={() => setSelectedResident(null)} className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">Propietario Principal</p>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center"><span className="material-symbols-outlined text-3xl">person</span></div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{selectedResident.name} {selectedResident.lastname}</h4>
                                        <p className="text-xs text-gray-500">{selectedResident.email || 'No registra correo'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">Personas Autorizadas (Ingreso Libre)</p>
                                <div className="space-y-3">
                                    {selectedResident.authorized && selectedResident.authorized.length > 0 ? (
                                        selectedResident.authorized.map((auth, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-gray-400">how_to_reg</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{auth.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{auth.idType}: {auth.idNumber}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-black uppercase tracking-widest">Activo</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic py-4 text-center">No hay registros de personas autorizadas para esta unidad.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex gap-3">
                            <button onClick={() => handleSendWhatsApp(selectedResident, 'NOVEDAD GENERAL')} className="flex-1 bg-primary text-black font-black py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"><span className="material-symbols-outlined filled">chat</span> Notificar por WhatsApp</button>
                            <button className="size-14 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white"><span className="material-symbols-outlined">call</span></button>
                        </div>
                    </div>
                </div>
            )}

            {/* SCANNER OVERLAY */}
            {isScannerOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={closeAll}></div>
                    <div className="relative size-72 mb-8">
                        <div className="absolute inset-0 border-4 border-primary rounded-[3rem] animate-pulse"></div>
                        <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-primary shadow-glow animate-scan-line"></div>
                    </div>
                    <h3 className="text-xl font-black text-primary uppercase tracking-[0.2em] animate-pulse">Detectando Código...</h3>
                    <button onClick={closeAll} className="mt-10 px-8 py-3 bg-white/10 text-white rounded-full font-bold uppercase text-[10px]">Cerrar Escáner</button>
                </div>
            )}

            <nav className="fixed bottom-0 w-full z-20 bg-white/90 dark:bg-surface-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-white/5 p-4 rounded-t-[2.5rem] max-w-md mx-auto flex justify-around items-center text-gray-400 transition-colors shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <button onClick={() => navigate('/admin/panel')} className="flex flex-col items-center p-2"><span className="material-symbols-outlined">dashboard</span><span className="text-[9px] font-black uppercase mt-1">Panel</span></button>
                <div className="relative -top-8">
                    <button onClick={() => setIsScannerOpen(true)} className="size-16 rounded-full bg-primary text-black shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-background-light dark:border-background-dark"><span className="material-symbols-outlined text-3xl">qr_code_scanner</span></button>
                </div>
                <button onClick={() => setFlowMode('notify')} className={`flex flex-col items-center p-2 transition-colors ${flowMode === 'notify' ? 'text-primary' : ''}`}><span className="material-symbols-outlined">contact_phone</span><span className="text-[9px] font-black uppercase mt-1">Directorio</span></button>
                <button className="flex flex-col items-center p-2"><span className="material-symbols-outlined">settings</span><span className="text-[9px] font-black uppercase mt-1">Ajustes</span></button>
            </nav>

            <style>{`
                @keyframes scan-line { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } } 
                .animate-scan-line { animation: scan-line 2.5s infinite ease-in-out; position: absolute; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default GatekeeperScreen;