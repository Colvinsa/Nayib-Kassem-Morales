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

const MONTHS = [
    { id: 1, name: 'Enero' }, { id: 2, name: 'Febrero' }, { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' }, { id: 5, name: 'Mayo' }, { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' }, { id: 8, name: 'Agosto' }, { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' }, { id: 11, name: 'Noviembre' }, { id: 12, name: 'Diciembre' }
];

const AdminFinancialsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [editingMonth, setEditingMonth] = useState<number | null>(null);
    
    // Form States
    const [budgetAssigned, setBudgetAssigned] = useState<number>(0);
    const [collectionReal, setCollectionReal] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);

    useEffect(() => {
        const stored = localStorage.getItem('community_financials');
        if (stored) {
            setRecords(JSON.parse(stored));
        }
    }, []);

    const handleEditMonth = (monthId: number) => {
        const existing = records.find(r => r.monthId === monthId);
        setEditingMonth(monthId);
        if (existing) {
            setBudgetAssigned(existing.budgetAssigned);
            setCollectionReal(existing.collectionReal);
            setIncome(existing.income);
            setExpenses(existing.expenses);
        } else {
            setBudgetAssigned(0);
            setCollectionReal(0);
            setIncome(0);
            setExpenses(0);
        }
    };

    const handleSave = () => {
        if (editingMonth === null) return;
        
        const monthObj = MONTHS.find(m => m.id === editingMonth)!;
        const newRecord: FinancialRecord = { 
            monthId: editingMonth, 
            monthName: monthObj.name,
            budgetAssigned, 
            collectionReal, 
            income, 
            expenses 
        };

        const filtered = records.filter(r => r.monthId !== editingMonth);
        const updated = [...filtered, newRecord].sort((a, b) => a.monthId - b.monthId);
        
        setRecords(updated);
        localStorage.setItem('community_financials', JSON.stringify(updated));
        setEditingMonth(null);
        alert(`Datos de ${monthObj.name} guardados. Los propietarios verán la gráfica actualizada.`);
    };

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    const calcPercent = (part: number, total: number) => {
        if (total === 0) return "0";
        return ((part / total) * 100).toFixed(1);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-12 transition-colors">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                <button onClick={() => navigate('/admin/panel')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gestión Financiera Anual</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
                {/* 12 Months Grid */}
                <section>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1 text-left">Seleccione Mes para Ingresar Cifras</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {MONTHS.map(m => {
                            const hasData = records.some(r => r.monthId === m.id);
                            return (
                                <button 
                                    key={m.id}
                                    onClick={() => handleEditMonth(m.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all aspect-square ${editingMonth === m.id ? 'bg-primary border-primary shadow-glow scale-105 z-10' : hasData ? 'bg-white dark:bg-surface-dark border-primary/30' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5 opacity-60'}`}
                                >
                                    <span className={`text-[10px] font-black uppercase ${editingMonth === m.id ? 'text-black' : 'text-gray-400'}`}>{m.name.substring(0,3)}</span>
                                    {hasData && <span className="material-symbols-outlined text-primary text-lg mt-1 filled">check_circle</span>}
                                    {!hasData && <span className="material-symbols-outlined text-gray-300 text-lg mt-1">pending</span>}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Edit Form */}
                {editingMonth && (
                    <section className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-primary shadow-xl text-left animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Cifras de {MONTHS.find(m => m.id === editingMonth)?.name}</h2>
                            <button onClick={() => setEditingMonth(null)} className="text-gray-400"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <h3 className="text-[10px] font-black uppercase text-primary">Presupuesto Asamblea vs Recaudo</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Meta Presupuesto (Valor Absoluto $)</label>
                                        <input type="number" value={budgetAssigned || ''} onChange={e => setBudgetAssigned(Number(e.target.value))} placeholder="Ej: 150000000" className="w-full bg-white dark:bg-black/20 border-0 ring-1 ring-gray-100 dark:ring-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Recaudo Logrado (Valor Absoluto $)</label>
                                        <input type="number" value={collectionReal || ''} onChange={e => setCollectionReal(Number(e.target.value))} placeholder="Ej: 142000000" className="w-full bg-white dark:bg-black/20 border-0 ring-1 ring-gray-100 dark:ring-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none mt-1" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <p className="text-[10px] font-black text-primary uppercase">Cálculo Automático:</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{calcPercent(collectionReal, budgetAssigned)}% de Ejecución</p>
                                </div>
                            </div>

                            <div className="space-y-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                <h3 className="text-[10px] font-black uppercase text-blue-500">Flujo de Caja Mensual</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Ingresos Totales ($)</label>
                                        <input type="number" value={income || ''} onChange={e => setIncome(Number(e.target.value))} placeholder="Entradas de Dinero" className="w-full bg-white dark:bg-black/20 border-0 ring-1 ring-gray-100 dark:ring-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Gastos / Egresos ($)</label>
                                        <input type="number" value={expenses || ''} onChange={e => setExpenses(Number(e.target.value))} placeholder="Salidas de Dinero" className="w-full bg-white dark:bg-black/20 border-0 ring-1 ring-gray-100 dark:ring-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none mt-1" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <p className="text-[10px] font-black text-blue-500 uppercase">Balance:</p>
                                    <p className={`text-sm font-black ${income >= expenses ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatCurrency(income - expenses)}
                                    </p>
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full bg-primary text-black font-black py-4 rounded-2xl shadow-lg text-xs uppercase tracking-widest active:scale-95 transition-all">
                                Guardar y Graficar Año
                            </button>
                        </div>
                    </section>
                )}

                {!editingMonth && records.length > 0 && (
                    <section className="text-left animate-fade-in">
                        <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-4 ml-1">Resumen de Cifras Ingresadas</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-gray-50 dark:bg-white/5 uppercase font-black text-gray-400">
                                    <tr>
                                        <th className="p-3">Mes</th>
                                        <th className="p-3">Recaudo %</th>
                                        <th className="p-3">Ingresos</th>
                                        <th className="p-3">Gastos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {records.map(r => (
                                        <tr key={r.monthId} className="text-slate-900 dark:text-white font-bold">
                                            <td className="p-3">{r.monthName}</td>
                                            <td className="p-3 text-primary">{calcPercent(r.collectionReal, r.budgetAssigned)}%</td>
                                            <td className="p-3">{formatCurrency(r.income)}</td>
                                            <td className="p-3">{formatCurrency(r.expenses)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminFinancialsScreen;