import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FinancialRecord {
    monthId: number;
    monthName: string;
    budgetAssigned: number;
    collectionReal: number;
    income: number;
    expenses: number;
}

const FinancialDashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<FinancialRecord[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('community_financials');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            // Datos semilla iniciales basados en valores absolutos
            const seed: FinancialRecord[] = [
                { monthId: 1, monthName: 'Enero', budgetAssigned: 150000000, collectionReal: 125000000, income: 130000000, expenses: 118000000 },
                { monthId: 2, monthName: 'Febrero', budgetAssigned: 150000000, collectionReal: 132000000, income: 135000000, expenses: 122000000 },
                { monthId: 3, monthName: 'Marzo', budgetAssigned: 155000000, collectionReal: 145000000, income: 148000000, expenses: 130000000 },
            ];
            setData(seed);
            localStorage.setItem('community_financials', JSON.stringify(seed));
        }
    }, []);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    const lastMonth = data[data.length - 1];
    const deficit = lastMonth ? lastMonth.income - lastMonth.expenses : 0;
    
    // Cálculo de Puntos para Gráfica Lineal
    const renderLineChart = () => {
        if (data.length < 2) return null;
        
        const width = 300;
        const height = 120;
        const padding = 20;
        
        const maxVal = Math.max(...data.map(d => Math.max(d.budgetAssigned, d.collectionReal)));
        const minVal = 0;
        
        const getX = (index: number) => (index / (data.length - 1)) * (width - 2 * padding) + padding;
        const getY = (value: number) => height - padding - ((value - minVal) / (maxVal - minVal)) * (height - 2 * padding);

        const budgetPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.budgetAssigned)}`).join(' ');
        const collectionPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.collectionReal)}`).join(' ');

        return (
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mt-4">
                {/* Grid Lines */}
                <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="currentColor" strokeOpacity="0.1" />
                
                {/* Budget Line (Dashed) */}
                <path d={budgetPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" />
                
                {/* Collection Line (Solid) */}
                <path d={collectionPath} fill="none" stroke="#36e27b" strokeWidth="3" strokeLinecap="round" className="drop-shadow-sm" />
                
                {/* Data Points */}
                {data.map((d, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(d.collectionReal)} r="4" fill="#36e27b" stroke="white" strokeWidth="1" />
                ))}
            </svg>
        );
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-12 transition-colors overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Gestión Financiera</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
                {/* Resumen Actual */}
                <section className="bg-primary/10 border border-primary/20 rounded-3xl p-6 text-left relative overflow-hidden animate-fade-in">
                    <div className="relative z-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-dark dark:text-primary/70 mb-1">Corte {lastMonth?.monthName} 2024</h2>
                        <div className="flex items-baseline gap-2">
                             <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                {deficit >= 0 ? 'Superávit' : 'Déficit'}
                             </h3>
                             <p className={`text-sm font-bold ${deficit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {formatCurrency(Math.abs(deficit))}
                             </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            Balance operativo del mes actual frente a ingresos y egresos registrados.
                        </p>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-primary opacity-10 text-[120px]">account_balance_wallet</span>
                </section>

                {/* Tendencia Lineal Anual */}
                <section className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tendencia de Recaudo Anual</h4>
                        <div className="flex gap-4">
                             <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-blue-500"></span>
                                <span className="text-[8px] font-bold uppercase text-gray-400">Meta</span>
                             </div>
                             <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-primary"></span>
                                <span className="text-[8px] font-bold uppercase text-gray-400">Real</span>
                             </div>
                        </div>
                    </div>
                    
                    {renderLineChart()}
                    
                    <div className="flex justify-between px-2">
                         {data.map((d, i) => (
                             <span key={i} className="text-[9px] font-black text-gray-400 uppercase">{d.monthName.substring(0,3)}</span>
                         ))}
                    </div>
                </section>

                {/* Gráfico 2: Detalle de Flujo de Caja */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-1 text-left">Ejecución Presupuestal Detallada</h4>
                    <div className="space-y-3">
                        {data.slice().reverse().map((record, i) => {
                            const max = Math.max(...data.map(r => Math.max(r.income, r.expenses)));
                            const incomeWidth = (record.income / max) * 100;
                            const expenseWidth = (record.expenses / max) * 100;
                            const executionRate = ((record.collectionReal / record.budgetAssigned) * 100).toFixed(1);

                            return (
                                <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4 animate-slide-up">
                                    <div className="flex justify-between items-center mb-1">
                                        <div>
                                            <span className="text-sm font-black uppercase text-slate-900 dark:text-white">{record.monthName}</span>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Ejecución: {executionRate}%</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${record.income >= record.expenses ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                                            {record.income >= record.expenses ? 'Superávit' : 'Déficit'}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                                                <div style={{ width: `${incomeWidth}%` }} className="h-full bg-green-500 transition-all duration-1000"></div>
                                            </div>
                                            <div className="flex justify-between mt-1.5">
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Ingresos Reales</p>
                                                <p className="text-[9px] font-black text-green-600">{formatCurrency(record.income)}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                                                <div style={{ width: `${expenseWidth}%` }} className="h-full bg-orange-500 transition-all duration-1000"></div>
                                            </div>
                                            <div className="flex justify-between mt-1.5">
                                                <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Gastos Ejecutados</p>
                                                <p className="text-[9px] font-black text-orange-600">{formatCurrency(record.expenses)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="p-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center gap-4 text-left shadow-xl">
                     <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Nota de Gestión</p>
                        <p className="text-[11px] font-medium leading-relaxed">
                            Los porcentajes se calculan automáticamente basándose en los ingresos brutos y gastos operativos consolidados mes a mes.
                        </p>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default FinancialDashboardScreen;