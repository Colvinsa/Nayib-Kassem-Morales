import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Amenity {
    id: string;
    name: string;
    category: 'Deportes' | 'Zonas Húmedas' | 'Club House' | 'Eventos';
    icon: string;
    minAge?: number;
}

const amenitiesData: Amenity[] = [
    { id: 'pool1', name: 'Piscina 1', category: 'Zonas Húmedas', icon: 'pool' },
    { id: 'pool2', name: 'Piscina 2', category: 'Zonas Húmedas', icon: 'pool' },
    { id: 'jacuzzi1', name: 'Jacuzzi 1', category: 'Zonas Húmedas', icon: 'hot_tub', minAge: 18 },
    { id: 'jacuzzi2', name: 'Jacuzzi 2', category: 'Zonas Húmedas', icon: 'hot_tub', minAge: 18 },
    { id: 'jacuzzi3', name: 'Jacuzzi 3', category: 'Zonas Húmedas', icon: 'hot_tub', minAge: 18 },
    { id: 'soccer1', name: 'Cancha de Fútbol 1', category: 'Deportes', icon: 'sports_soccer' },
    { id: 'soccer2', name: 'Cancha de Fútbol 2', category: 'Deportes', icon: 'sports_soccer' },
    { id: 'pingpong', name: 'Ping Pong', category: 'Club House', icon: 'sports_tennis' },
    { id: 'gym', name: 'Gimnasio', category: 'Club House', icon: 'fitness_center' },
    { id: 'pool_table', name: 'Billar Pool', category: 'Club House', icon: 'casino' },
    { id: 'billiards', name: 'Billar Libres', category: 'Club House', icon: 'casino' },
    { id: 'darts', name: 'Dardos', category: 'Club House', icon: 'gps_fixed' },
    { id: 'hall', name: 'Salón Comunal', category: 'Eventos', icon: 'celebration' },
];

const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const ReservationScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSolvent, setIsSolvent] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    
    // Modal State
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
    const [isBooking, setIsBooking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Categories that are BLOCKED if insolvent
    const RESTRICTED_CATEGORIES = ['Zonas Húmedas', 'Club House', 'Eventos'];

    // Simulate database check for solvency
    const checkSolvency = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const storedStatus = localStorage.getItem('unit_status_B_402');
                const isUserUpToDate = storedStatus === 'insolvent' ? false : true;
                resolve(isUserUpToDate);
            }, 800);
        });
    };

    useEffect(() => {
        const verifyStatus = async () => {
            try {
                const status = await checkSolvency();
                setIsSolvent(status);
            } catch (error) {
                console.error("Error checking solvency", error);
                setIsSolvent(false);
            } finally {
                setIsLoading(false);
            }
        };
        verifyStatus();
    }, []);

    useEffect(() => {
        if (selectedDate && selectedAmenity) {
            const mockOccupied = timeSlots.filter(() => Math.random() < 0.3);
            setOccupiedSlots(mockOccupied);
            setSelectedTime(null);
        }
    }, [selectedDate, selectedAmenity]);

    const handleOpenModal = (amenity: Amenity) => {
        setSelectedAmenity(amenity);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
        setIsSuccess(false);
    };

    const handleCloseModal = () => {
        setSelectedAmenity(null);
        setSelectedDate('');
        setSelectedTime(null);
    };

    const handleConfirmBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            setIsSuccess(true);
        }, 1500);
    };

    const categories = ['Todos', 'Zonas Húmedas', 'Deportes', 'Club House', 'Eventos'];
    
    const filteredAmenities = selectedCategory === 'Todos' 
        ? amenitiesData 
        : amenitiesData.filter(a => a.category === selectedCategory);

    const isHall = selectedAmenity?.id === 'hall';

    return (
        <div className="relative flex min-h-screen flex-col w-full overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark transition-colors">
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-2 border-b border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md sticky top-0">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Reservar Espacios</h1>
                <div className="size-10"></div> 
            </div>

            <main className="relative z-10 flex-1 overflow-y-auto pb-24 scrollbar-hide">
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Verificando estado de cuenta...</p>
                    </div>
                ) : (
                    <>
                        {/* Categories */}
                        <div className="px-6 py-4">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-gradient">
                                {categories.map((cat) => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Warning if Insolvent */}
                        {!isSolvent && (
                             <div className="mx-6 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 shrink-0">info</span>
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-red-500">Acceso Limitado</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Presentas mora en administración. El acceso a Zonas Húmedas, Club House y Salón Comunal está restringido.
                                    </p>
                                </div>
                             </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-2 gap-4 px-6 pb-6">
                            {filteredAmenities.map((amenity) => {
                                const isBlocked = !isSolvent && RESTRICTED_CATEGORIES.includes(amenity.category);

                                return (
                                    <div key={amenity.id} className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition-all ${isBlocked ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-70' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5 hover:shadow-md active:scale-[0.98]'} text-left`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${isBlocked ? 'bg-gray-200 dark:bg-white/10 text-gray-400' : 'bg-gray-50 dark:bg-white/5 text-primary group-hover:bg-primary/10'}`}>
                                                <span className="material-symbols-outlined">{amenity.icon}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {amenity.minAge && (
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/20 shadow-sm">
                                                        +{amenity.minAge}
                                                    </span>
                                                )}
                                                {isBlocked ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 border border-red-200 dark:border-red-900/30 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20">
                                                        Bloqueado
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/5 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5">
                                                        Libre
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{amenity.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{amenity.category}</p>
                                        </div>
                                        <button 
                                            disabled={isBlocked}
                                            onClick={() => handleOpenModal(amenity)}
                                            className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors ${isBlocked ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-white/10 text-white hover:bg-primary hover:text-black'}`}
                                        >
                                            {isBlocked ? 'Restringido' : 'Reservar'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            {/* Booking Modal */}
            {selectedAmenity && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    ></div>
                    
                    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-background-light dark:bg-surface-dark shadow-2xl ring-1 ring-white/10 transition-transform duration-300 animate-slide-up sm:animate-zoom-in text-left">
                        
                        {!isSuccess ? (
                            <div className="flex flex-col max-h-[85vh]">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 p-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reservar {selectedAmenity.name}</h3>
                                    <button onClick={handleCloseModal} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10">
                                        <span className="material-symbols-outlined text-gray-500">close</span>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                            Seleccionar Fecha
                                        </label>
                                        <input 
                                            type="date" 
                                            value={selectedDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-3 text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {isHall ? 'Bloque de Reserva' : 'Horario (Max 1 hora)'}
                                            </label>
                                            {!isHall && (
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-primary"></span>
                                                    <span className="text-[10px] text-gray-400">Libre</span>
                                                    <span className="size-2 rounded-full bg-gray-300 dark:bg-white/10 ml-1"></span>
                                                    <span className="text-[10px] text-gray-400">Ocupado</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {isHall ? (
                                            <div className="flex flex-col gap-3 animate-fade-in">
                                                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="material-symbols-outlined text-primary">schedule</span>
                                                        <h4 className="font-bold text-primary text-sm">Evento - 12 Horas</h4>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                                                        El Salón Comunal se reserva exclusivamente por turnos completos de 12 horas para garantizar el desarrollo de su evento.
                                                    </p>
                                                    <button
                                                        onClick={() => setSelectedTime("09:00 - 21:00")}
                                                        className={`w-full py-3 rounded-xl border transition-all font-bold text-sm flex items-center justify-center gap-2
                                                            ${selectedTime === "09:00 - 21:00"
                                                                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                                                                : 'bg-white dark:bg-black/20 text-slate-700 dark:text-white border-gray-200 dark:border-white/10 hover:border-primary/50'
                                                            }
                                                        `}
                                                    >
                                                        {selectedTime === "09:00 - 21:00" && <span className="material-symbols-outlined text-[18px]">check</span>}
                                                        09:00 AM - 09:00 PM
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2">
                                                {timeSlots.map((time) => {
                                                    const isOccupied = occupiedSlots.includes(time);
                                                    const isSelected = selectedTime === time;
                                                    return (
                                                        <button
                                                            key={time}
                                                            disabled={isOccupied}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`py-2 rounded-lg text-xs font-bold transition-all 
                                                                ${isOccupied 
                                                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/20 cursor-not-allowed line-through' 
                                                                    : isSelected 
                                                                        ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' 
                                                                        : 'bg-white dark:bg-black/20 text-slate-700 dark:text-white border border-gray-100 dark:border-white/5 hover:border-primary/50'
                                                                }
                                                            `}
                                                        >
                                                            {time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                                                    {selectedAmenity.minAge && (
                                                        <span className="block font-bold text-orange-600 dark:text-orange-400 mb-1">
                                                            ATENCIÓN: Solo mayores de {selectedAmenity.minAge} años.
                                                        </span>
                                                    )}
                                                    {isHall 
                                                        ? 'Recuerda que debes realizar la entrega del salón limpio y en perfectas condiciones al finalizar tu evento.'
                                                        : 'Recuerda llegar 5 minutos antes. La reserva se mantendrá por 15 minutos máximo.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                                    <button 
                                        disabled={!selectedTime || !selectedDate || isBooking}
                                        onClick={handleConfirmBooking}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-black shadow-lg shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {isBooking ? (
                                            <>
                                                <div className="size-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
                                                Confirmando...
                                            </>
                                        ) : (
                                            <>
                                                Confirmar Reserva
                                                <span className="material-symbols-outlined filled text-[18px]">check_circle</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="size-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-500 mb-4 animate-bounce-subtle">
                                    <span className="material-symbols-outlined text-[40px] filled">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Reserva Exitosa!</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Has reservado <strong>{selectedAmenity.name}</strong> para el día <strong>{selectedDate}</strong>.<br/>
                                    <span className="block mt-1 text-primary font-bold">{selectedTime}</span>
                                </p>
                                <button 
                                    onClick={handleCloseModal}
                                    className="w-full rounded-xl bg-slate-900 dark:bg-white/10 text-white py-3 text-sm font-bold hover:bg-slate-800 transition-colors"
                                >
                                    Entendido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationScreen;