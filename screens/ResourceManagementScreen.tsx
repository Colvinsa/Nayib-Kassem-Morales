
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

// --- MOCK DATA GENERATOR ---
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Generamos datos simulados con estacionalidad para mostrar picos y valles
const generateData = () => {
    return MONTHS.map((month, index) => {
        // Factor de estacionalidad (picos en vacaciones/verano)
        const seasonality = (month === 'Dic' || month === 'Ene' || month === 'Jun' || month === 'Jul') ? 1.2 : 1.0;
        const randomVar = 0.9 + Math.random() * 0.2; // Variación +/- 10%

        // CONSUMOS ENERGÍA (kWh)
        // 20 Ascensores: Consumo base alto, estable
        const elevators = Math.floor(12000 * randomVar); 
        // Bombas Piscina (2 unidades): Consumo medio
        const pumps = Math.floor(4500 * randomVar * (seasonality * 1.1)); // Más uso en temporada alta
        // Luminarias Zonas Comunes: Menor en verano (días largos), mayor en invierno
        const lighting = Math.floor(3000 * (index > 3 && index < 8 ? 0.8 : 1.2)); 
        // Otros consumos
        const baseLoad = 5000;
        
        const totalEnergy = elevators + pumps + lighting + baseLoad;

        // CONSUMOS AGUA (m3)
        // Piscinas (Llenado/Evaporación)
        const poolWater = Math.floor(800 * seasonality * randomVar);
        // Riego y Limpieza
        const commonWater = Math.floor(1200 * randomVar);
        // Consumo Habitacional (aprox)
        const residentialWater = Math.floor(15000 * seasonality * randomVar);

        const totalWater = poolWater + commonWater + residentialWater;

        return {
            month,
            energy: { total: totalEnergy, elevators, pumps, lighting },
            water: { total: totalWater, pool: poolWater, common: commonWater }
        };
    });
};

const DATA = generateData();

const ResourceManagementScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'energy' | 'water'>('energy');
    
    // Filtros interactivos para "cruzar" datos
    const [showElevators, setShowElevators] = useState(true);
    const [showPumps, setShowPumps] = useState(true);
    const [showLighting, setShowLighting] = useState(true);
    
    const [showPoolWater, setShowPoolWater] = useState(true);
    const [showCommonWater, setShowCommonWater] = useState(true);

    // --- CÁLCULOS ESTADÍSTICOS ---
    const stats = useMemo(() => {
        const list = DATA.map(d => activeTab === 'energy' ? d.energy.total : d.water.total);
        const maxVal = Math.max(...list);
        const minVal = Math.min(...list);
        const peakMonth = DATA.find(d => (activeTab === 'energy' ? d.energy.total : d.water.total) === maxVal)?.month;
        const valleyMonth = DATA.find(d => (activeTab === 'energy' ? d.energy.total : d.water.total) === minVal)?.month;
        const totalSum = list.reduce((a, b) => a + b, 0);
        const average = Math.floor(totalSum / list.length);

        // Medias específicas de motores
        const avgElevators = Math.floor(DATA.reduce((a, b) => a + b.energy.elevators, 0) / 12);
        const avgPumps = Math.floor(DATA.reduce((a, b) => a + b.energy.pumps, 0) / 12);
        const avgLighting = Math.floor(DATA.reduce((a, b) => a + b.energy.lighting, 0) / 12);
        const avgPoolWater = Math.floor(DATA.reduce((a, b) => a + b.water.pool, 0) / 12);

        return { maxVal, minVal, peakMonth, valleyMonth, average, avgElevators, avgPumps, avgLighting, avgPoolWater };
    }, [activeTab]);

    // --- RENDERIZADO DE GRÁFICA SVG ---
    const renderChart = () => {
        const height = 200;
        const width = 800; // viewBox width
        const padding = 40;
        const graphHeight = height - padding * 2;
        const graphWidth = width - padding * 2;
        
        // Escala Y dinámica
        const maxY = stats.maxVal * 1.1; // 10% margen arriba
        
        const getX = (index: number) => padding + (index / (DATA.length - 1)) * graphWidth;
        const getY = (val: number) => height - padding - (val / maxY) * graphHeight;

        // Paths Generadores
        const createPath = (keyExtractor: (d: any) => number) => {
            return DATA.map((d, i) => 
                `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(keyExtractor(d))}`
            ).join(' ');
        };

        const totalPath = createPath(d => activeTab === 'energy' ? d.energy.total : d.water.total);
        
        // Sub-paths Energía
        const elevPath = createPath(d => d.energy.elevators);
        const pumpsPath = createPath(d => d.energy.pumps);
        const lightPath = createPath(d => d.energy.lighting);

        // Sub-paths Agua
        const poolWPath = createPath(d => d.water.pool);
        const commonWPath = createPath(d => d.water.common);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Ejes y Grid */}
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />
                
                {/* Etiquetas X (Meses) */}
                {DATA.map((d, i) => (
                    <text key={i} x={getX(i)} y={height - 10} textAnchor="middle" className="text-[10px] fill-gray-400 font-bold uppercase">{d.month}</text>
                ))}

                {/* --- CAPAS DE DATOS --- */}
                
                {/* Linea Principal TOTAL (Fondo) */}
                <path d={totalPath} fill="none" stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeWidth="4" />
                
                {/* Energía: Capas Interactivas */}
                {activeTab === 'energy' && (
                    <>
                        {showElevators && <path d={elevPath} fill="none" stroke="#36e27b" strokeWidth="3" className="drop-shadow-md transition-all duration-500" strokeDasharray="0" />}
                        {showPumps && <path d={pumpsPath} fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-md transition-all duration-500" strokeDasharray="4" />}
                        {showLighting && <path d={lightPath} fill="none" stroke="#f59e0b" strokeWidth="3" className="drop-shadow-md transition-all duration-500" strokeDasharray="2" />}
                    </>
                )}

                {/* Agua: Capas Interactivas */}
                {activeTab === 'water' && (
                    <>
                        {showPoolWater && <path d={poolWPath} fill="none" stroke="#06b6d4" strokeWidth="3" className="drop-shadow-md transition-all duration-500" />}
                        {showCommonWater && <path d={commonWPath} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-md transition-all duration-500" strokeDasharray="4" />}
                    </>
                )}

                {/* Puntos Interactivos (Total) */}
                {DATA.map((d, i) => {
                    const val = activeTab === 'energy' ? d.energy.total : d.water.total;
                    const isPeak = d.month === stats.peakMonth;
                    const isValley = d.month === stats.valleyMonth;

                    return (
                        <g key={i}>
                            <circle cx={getX(i)} cy={getY(val)} r={isPeak || isValley ? 6 : 3} className={`${isPeak ? 'fill-red-500' : isValley ? 'fill-green-500' : 'fill-slate-400 dark:fill-gray-600'} transition-all`} />
                            {(isPeak || isValley) && (
                                <text x={getX(i)} y={getY(val) - 10} textAnchor="middle" className={`text-[10px] font-black uppercase ${isPeak ? 'fill-red-500' : 'fill-green-500'}`}>
                                    {isPeak ? 'Pico' : 'Valle'}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-12 transition-colors">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <button onClick={() => navigate('/admin/panel')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gestión de Recursos</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Medición y Control</p>
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                
                {/* TABS DE RECURSO */}
                <div className="flex p-1 bg-gray-100 dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5">
                    <button onClick={() => setActiveTab('energy')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'energy' ? 'bg-primary text-black shadow-sm' : 'text-gray-500'}`}>
                        <span className="material-symbols-outlined text-lg">bolt</span> Energía
                    </button>
                    <button onClick={() => setActiveTab('water')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'water' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500'}`}>
                        <span className="material-symbols-outlined text-lg">water_drop</span> Agua
                    </button>
                </div>

                {/* GRÁFICA PRINCIPAL */}
                <section className="bg-white dark:bg-surface-dark p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg animate-fade-in">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Consumo Anual</p>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                {activeTab === 'energy' ? 'Red Eléctrica' : 'Red Hidráulica'}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase text-gray-400">Promedio Mensual</p>
                            <p className="text-xl font-black text-primary">
                                {new Intl.NumberFormat('es-CO').format(stats.average)} <span className="text-xs text-gray-500">{activeTab === 'energy' ? 'kWh' : 'm³'}</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* SVG Chart */}
                    <div className="mb-6 bg-gray-50 dark:bg-black/20 rounded-2xl p-2 border border-gray-100 dark:border-white/5">
                        {renderChart()}
                    </div>

                    {/* Controles Interactivos (Leyenda) */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center mb-2">Cruzar con Motores / Consumo</p>
                        
                        {activeTab === 'energy' ? (
                            <div className="flex flex-wrap gap-2 justify-center">
                                <button onClick={() => setShowElevators(!showElevators)} className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${showElevators ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}>
                                    <span className={`size-2 rounded-full ${showElevators ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    20 Ascensores
                                </button>
                                <button onClick={() => setShowPumps(!showPumps)} className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${showPumps ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}>
                                    <span className={`size-2 rounded-full ${showPumps ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                                    2 Bombas Piscina
                                </button>
                                <button onClick={() => setShowLighting(!showLighting)} className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${showLighting ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}>
                                    <span className={`size-2 rounded-full ${showLighting ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                                    Luminarias
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 justify-center">
                                <button onClick={() => setShowPoolWater(!showPoolWater)} className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${showPoolWater ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}>
                                    <span className={`size-2 rounded-full ${showPoolWater ? 'bg-cyan-500' : 'bg-gray-400'}`}></span>
                                    Piscinas (2)
                                </button>
                                <button onClick={() => setShowCommonWater(!showCommonWater)} className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${showCommonWater ? 'bg-violet-500/10 border-violet-500 text-violet-600 dark:text-violet-400' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}>
                                    <span className={`size-2 rounded-full ${showCommonWater ? 'bg-violet-500' : 'bg-gray-400'}`}></span>
                                    Riego Zonas Verdes
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* DETALLE DE PICOS Y VALLES */}
                <section className="grid grid-cols-2 gap-4 animate-slide-up">
                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="size-10 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Mes Pico</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.peakMonth}</p>
                        <p className="text-xs font-bold text-gray-500">{new Intl.NumberFormat('es-CO').format(stats.maxVal)} {activeTab === 'energy' ? 'kWh' : 'm³'}</p>
                    </div>
                    
                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="size-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined">trending_down</span>
                        </div>
                        <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">Mes Valle</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.valleyMonth}</p>
                        <p className="text-xs font-bold text-gray-500">{new Intl.NumberFormat('es-CO').format(stats.minVal)} {activeTab === 'energy' ? 'kWh' : 'm³'}</p>
                    </div>
                </section>

                {/* TARJETAS DE CÁLCULO DE MOTORES */}
                {activeTab === 'energy' && (
                    <section className="space-y-3 animate-slide-up delay-75">
                        <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Análisis de Motores y Cargas</h3>
                        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            
                            {/* Ascensores */}
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined">elevator</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">20 Ascensores</p>
                                        <p className="text-[10px] text-gray-500">Uso continuo</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('es-CO').format(stats.avgElevators)} kWh</p>
                                    <p className="text-[9px] text-gray-400 uppercase">Promedio Mensual</p>
                                </div>
                            </div>

                             {/* Bombas */}
                             <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined">water_pump</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Bombas Piscinas (2)</p>
                                        <p className="text-[10px] text-gray-500">Ciclos de filtrado</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('es-CO').format(stats.avgPumps)} kWh</p>
                                    <p className="text-[9px] text-gray-400 uppercase">Promedio Mensual</p>
                                </div>
                            </div>

                            {/* Iluminación */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-yellow-100 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Zonas Comunes</p>
                                        <p className="text-[10px] text-gray-500">Luminarias LED</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('es-CO').format(stats.avgLighting)} kWh</p>
                                    <p className="text-[9px] text-gray-400 uppercase">Promedio Mensual</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'water' && (
                     <section className="space-y-3 animate-slide-up delay-75">
                        <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest ml-1">Análisis de Consumo Hídrico</h3>
                         <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                             {/* Piscinas */}
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-cyan-100 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                        <span className="material-symbols-outlined">pool</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Piscinas (2)</p>
                                        <p className="text-[10px] text-gray-500">Compensación y lavado</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('es-CO').format(stats.avgPoolWater)} m³</p>
                                    <p className="text-[9px] text-gray-400 uppercase">Promedio Mensual</p>
                                </div>
                            </div>
                         </div>
                     </section>
                )}
            </main>
        </div>
    );
};

export default ResourceManagementScreen;
