import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPaymentsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadSuccess(false);
            setProgress(0);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setIsUploading(true);
        setProgress(0);
        setUploadSuccess(false);

        // Simular carga progresiva
        const interval = setInterval(() => {
            setProgress((prev) => {
                const increment = Math.random() * 15;
                const next = prev + increment;

                if (next >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setUploadSuccess(true);
                    
                    // Actualizar estado de ejemplo a solvente tras procesar el archivo
                    localStorage.setItem('unit_status_B_402', 'solvent');
                    
                    setTimeout(() => {
                        setUploadSuccess(false);
                        setFile(null);
                        setProgress(0);
                    }, 4000);
                    
                    return 100;
                }
                return next;
            });
        }, 300);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                 <button onClick={() => navigate('/admin/panel')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gestión de Cartera</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 p-6 space-y-8">
                {/* Upload Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-left">
                        <span className="material-symbols-outlined text-primary">table_view</span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actualizar Cartera</h2>
                    </div>
                    <div className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors ${uploadSuccess ? 'border-green-500 bg-green-500/5' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark shadow-sm'}`}>
                        <input 
                            type="file" 
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            className="hidden" 
                            id="file-upload"
                            disabled={isUploading}
                        />
                        <label htmlFor="file-upload" className={`cursor-pointer flex flex-col items-center ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                            {uploadSuccess ? (
                                <div className="size-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4 animate-bounce-subtle">
                                    <span className="material-symbols-outlined text-4xl filled">check_circle</span>
                                </div>
                            ) : (
                                <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-4xl">upload_file</span>
                                </div>
                            )}
                            
                            <span className="text-base font-bold text-slate-900 dark:text-white mb-1">
                                {file ? file.name : "Seleccionar Archivo"}
                            </span>
                            <span className="text-xs text-gray-500 max-w-[200px]">Carga el consolidado mensual de cartera (.xlsx o .csv)</span>
                        </label>
                    </div>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || isUploading || uploadSuccess}
                        className="relative w-full mt-6 h-14 rounded-2xl overflow-hidden bg-slate-900 dark:bg-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all active:scale-[0.98]"
                    >
                        <div 
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>

                        <div className="relative z-10 flex items-center justify-center gap-3 w-full h-full">
                            {isUploading ? (
                                <span className="text-white dark:text-black font-black text-sm uppercase tracking-widest">Procesando {Math.round(progress)}%</span>
                            ) : uploadSuccess ? (
                                <>
                                    <span className="material-symbols-outlined text-white dark:text-black font-bold">done_all</span>
                                    <span className="text-white dark:text-black font-black text-sm uppercase tracking-widest">Base de Datos Actualizada</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-white dark:text-black font-black text-sm uppercase tracking-widest">Cargar Información</span>
                                    <span className="material-symbols-outlined text-white dark:text-black text-xl">send</span>
                                </>
                            )}
                        </div>
                    </button>
                    
                    <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-left flex gap-4">
                        <span className="material-symbols-outlined text-blue-500 shrink-0">info</span>
                        <div>
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Instrucciones</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                El sistema procesará el archivo para actualizar automáticamente el estado de <strong>Paz y Salvo</strong> o <strong>Mora</strong> de todas las unidades residenciales. Asegúrese de que el archivo contenga las columnas de Torre y Apartamento.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {uploadSuccess && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-50 animate-slide-up">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                        <div className="bg-primary rounded-full p-1.5 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-xl font-black">check</span>
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-sm">Cartera Actualizada</h4>
                            <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Sincronización completada con éxito</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsScreen;