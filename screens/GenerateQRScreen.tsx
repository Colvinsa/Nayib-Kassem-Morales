
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
// Importamos jsQR desde el importmap
import jsQR from 'jsqr';

interface VisitorPass {
    id: string;
    firstName: string;
    lastName: string;
    unit: string;
    block: string;
    startDateTime: string;
    endDateTime: string;
    timestamp: number;
}

const GenerateQRScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // UI States
    const [activeTab, setActiveTab] = useState<'create' | 'scan'>('create');
    const [showQRModal, setShowQRModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ pass: VisitorPass | null; status: 'valid' | 'invalid' | 'expired' | null }>({ pass: null, status: null });
    
    // Camera Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [unit, setUnit] = useState('');
    const [block, setBlock] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    
    const [activePass, setActivePass] = useState<VisitorPass | null>(null);

    const handleBack = () => {
        const returnPath = (location.state as any)?.returnTo || -1;
        navigate(returnPath);
    };

    const handleGenerate = () => {
        if (!firstName || !lastName || !unit || !block || !startDateTime || !endDateTime) {
            alert("Por favor completa todos los campos para generar el pase.");
            return;
        }

        const newPass: VisitorPass = {
            id: `PA-${Date.now()}`,
            firstName,
            lastName,
            unit,
            block,
            startDateTime,
            endDateTime,
            timestamp: Date.now()
        };

        const existingRaw = localStorage.getItem('registered_pases');
        const pases = existingRaw ? JSON.parse(existingRaw) : [];
        pases.push(newPass);
        localStorage.setItem('registered_pases', JSON.stringify(pases));

        setActivePass(newPass);
        setShowQRModal(true);
    };

    const startCamera = async () => {
        setScanning(true);
        setScanResult({ pass: null, status: null });
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true");
                videoRef.current.play();
                requestRef.current = requestAnimationFrame(scanTick);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
            setScanning(false);
        }
    };

    const stopCamera = () => {
        setScanning(false);
        cancelAnimationFrame(requestRef.current);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const scanTick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            if (context) {
                canvas.height = videoRef.current.videoHeight;
                canvas.width = videoRef.current.videoWidth;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    try {
                        const parsedData = JSON.parse(code.data);
                        processScanResult(parsedData.id);
                        return; // Detener el tick si encontramos algo
                    } catch (e) {
                        // Si no es un JSON válido nuestro, seguimos buscando
                        console.debug("QR detectado no es formato Puerto Azul");
                    }
                }
            }
        }
        if (scanning) {
            requestRef.current = requestAnimationFrame(scanTick);
        }
    };

    const processScanResult = (passId: string) => {
        stopCamera();
        const existingRaw = localStorage.getItem('registered_pases');
        const pases: VisitorPass[] = existingRaw ? JSON.parse(existingRaw) : [];
        const found = pases.find(p => p.id === passId);

        if (!found) {
            setScanResult({ pass: null, status: 'invalid' });
        } else {
            const now = new Date().getTime();
            const end = new Date(found.endDateTime).getTime();
            if (now > end) {
                setScanResult({ pass: found, status: 'expired' });
            } else {
                setScanResult({ pass: found, status: 'valid' });
            }
        }
    };

    const getRemainingTime = (endDateStr: string) => {
        const end = new Date(endDateStr).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) return "Expirado";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m`;
    };

    const generateQRUrl = (data: VisitorPass) => {
        const content = JSON.stringify({
            id: data.id,
            nom: `${data.firstName} ${data.lastName}`,
            loc: `B${data.block}-A${data.unit}`,
            val: `${data.startDateTime} a ${data.endDateTime}`
        });
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(content)}&margin=10`;
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col w-full bg-background-light dark:bg-background-dark font-display transition-colors">
            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    #carnet-print, #carnet-print * { visibility: visible; }
                    #carnet-print {
                        position: fixed;
                        left: 50%; top: 50%;
                        transform: translate(-50%, -50%);
                        width: 85.6mm;
                        height: 53.98mm;
                        padding: 5mm;
                        background: white !important;
                        color: black !important;
                        display: flex !important;
                        flex-direction: row;
                        border: 1px solid #ddd;
                        border-radius: 2mm;
                        align-items: center;
                        z-index: 9999;
                    }
                    .no-print { display: none !important; }
                }
                `}
            </style>

            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5 no-print">
                <button onClick={handleBack} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold">Gestión de Accesos</h1>
                <ThemeToggle />
            </header>

            <main className="flex-1 p-6 space-y-6 no-print overflow-y-auto pb-24 text-left">
                <div className="flex p-1 bg-gray-100 dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5">
                    <button onClick={() => { setActiveTab('create'); stopCamera(); }} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-primary text-black shadow-sm' : 'text-gray-500'}`}>Crear Pase QR</button>
                    <button onClick={() => setActiveTab('scan')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'scan' ? 'bg-primary text-black shadow-sm' : 'text-gray-500'}`}>Escanear / Ver</button>
                </div>

                {activeTab === 'create' ? (
                    <div className="space-y-5 animate-fade-in">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Datos del Visitante</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombres</label>
                                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ej. Juan" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Apellidos</label>
                                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ej. Pérez" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Apartamento</label>
                                    <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Ej. 402" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Bloque / Torre</label>
                                    <input value={block} onChange={e => setBlock(e.target.value)} placeholder="Ej. B" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest pt-2">Rango de Autorización</h3>
                            <div className="space-y-3">
                                <input value={startDateTime} onChange={e => setStartDateTime(e.target.value)} type="datetime-local" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white" />
                                <input value={endDateTime} onChange={e => setEndDateTime(e.target.value)} type="datetime-local" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white" />
                            </div>
                            <button onClick={handleGenerate} className="w-full bg-primary text-black font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 mt-4 active:scale-95 transition-transform">Generar Pase</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in text-center">
                        {!scanning && !scanResult.status && (
                            <>
                                <div className="size-48 bg-primary/10 rounded-3xl border-2 border-dashed border-primary/30 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-6xl">qr_code_scanner</span></div>
                                <h3 className="text-xl font-bold">Lector de Pases</h3>
                                <button onClick={startCamera} className="bg-primary text-black px-8 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-transform">Iniciar Cámara</button>
                            </>
                        )}

                        {scanning && (
                            <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-3xl border-4 border-primary shadow-glow">
                                <video ref={videoRef} className="w-full h-full object-cover" />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="w-4/5 h-0.5 bg-primary shadow-glow animate-pulse"></div>
                                    <p className="mt-4 text-[10px] font-bold bg-black/60 text-white px-3 py-1 rounded-full uppercase tracking-widest">Escaneando...</p>
                                </div>
                                <button onClick={stopCamera} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase">Cancelar</button>
                            </div>
                        )}

                        {scanResult.status && (
                            <div className="w-full animate-zoom-in space-y-4">
                                {scanResult.status === 'valid' && scanResult.pass ? (
                                    <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-green-500 shadow-lg text-left">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-12 rounded-full bg-green-500 flex items-center justify-center text-white"><span className="material-symbols-outlined">verified</span></div>
                                            <div>
                                                <h3 className="text-xl font-black text-green-500 uppercase tracking-tight">Acceso Permitido</h3>
                                                <p className="text-xs text-gray-500">Pase verificado correctamente</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Visitante</p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{scanResult.pass.firstName} {scanResult.pass.lastName}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Autorizado por</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-gray-300">Torre {scanResult.pass.block} - Apto {scanResult.pass.unit}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tiempo Restante</p>
                                                    <p className="text-sm font-black text-primary">{getRemainingTime(scanResult.pass.endDateTime)}</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-gray-200 dark:border-white/5">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Vigencia</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Desde: {new Date(scanResult.pass.startDateTime).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Hasta: {new Date(scanResult.pass.endDateTime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setScanResult({ pass: null, status: null })} className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-4">Nuevo Escaneo</button>
                                    </div>
                                ) : scanResult.status === 'expired' ? (
                                    <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-orange-500 shadow-lg text-left">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-12 rounded-full bg-orange-500 flex items-center justify-center text-white"><span className="material-symbols-outlined">timer_off</span></div>
                                            <div>
                                                <h3 className="text-xl font-black text-orange-500 uppercase tracking-tight">Pase Expirado</h3>
                                                <p className="text-xs text-gray-500">El tiempo de estadía ha finalizado</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Este pase ya no es válido para ingreso. El visitante debió salir hace {getRemainingTime(scanResult.pass!.endDateTime).replace('-', '')}.</p>
                                        <button onClick={() => setScanResult({ pass: null, status: null })} className="w-full bg-gray-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-xl">Volver a Intentar</button>
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-red-500 shadow-lg text-left">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-12 rounded-full bg-red-500 flex items-center justify-center text-white"><span className="material-symbols-outlined">dangerous</span></div>
                                            <div>
                                                <h3 className="text-xl font-black text-red-500 uppercase tracking-tight">No Registrado</h3>
                                                <p className="text-xs text-gray-500">Pase no encontrado en la base de datos</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Este código no coincide con ningún pase activo en el sistema Puerto Azul.</p>
                                        <button onClick={() => setScanResult({ pass: null, status: null })} className="w-full bg-red-500 text-white font-bold py-3 rounded-xl">Reintentar</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {showQRModal && activePass && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-center">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowQRModal(false)}></div>
                    {/* Se añade ID para impresión y se quita 'no-print' de la jerarquía directa que bloquea la visualización */}
                    <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center animate-zoom-in" id="carnet-print">
                        <div className="bg-white p-4 rounded-3xl mb-6 shadow-2xl border border-gray-100"><img src={generateQRUrl(activePass)} className="size-48" alt="QR" /></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{activePass.firstName} {activePass.lastName}</h3>
                        <p className="text-primary font-black tracking-widest text-sm mb-6 uppercase">BLOQUE {activePass.block} • APTO {activePass.unit}</p>
                        <button onClick={() => window.print()} className="w-full bg-primary text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 no-print"><span className="material-symbols-outlined">print</span> Imprimir</button>
                        <button onClick={() => setShowQRModal(false)} className="w-full py-4 text-gray-400 text-sm font-bold no-print">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateQRScreen;
    