import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Admin Emails Configuration
const ADMIN_EMAILS = ['kassemnayib@yahoo.com', 'admin@puertoazul.com'];

// Fallback Mock data only if localStorage is empty (Matches content of Propietarios.xlsx)
const FALLBACK_DB = [
    { id: '1', torre: 'A', apto: '101', name: 'Maria', lastname: 'Rodriguez', email: 'maria.rodriguez@email.com', tel1: '573001234567' },
    { id: '2', torre: 'B', apto: '402', name: 'Carlos', lastname: 'Ruiz', email: 'carlos.ruiz@email.com', tel1: '573005551234' },
    { id: '4', torre: '3', apto: '102', name: 'Juan', lastname: 'Perez', email: 'propietario@test.com', tel1: '3000000000' },
    { id: '5', torre: 'C', apto: '202', name: 'Pedro', lastname: 'Pascal', email: 'pedro.pascal@hollywood.com', tel1: '3200000000' }
];

const ResidentRegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        unitCode: '', // New field for "3102"
        email: '',
        phone1: '',
        phone2: ''
    });

    // Credentials Data
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    // Helper to normalize text (remove accents, lowercase) for better matching
    // Example: "Gómez" matches "Gomez"
    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const verifyUser = () => {
        if (!formData.unitCode || !formData.name || !formData.lastname) {
            setError('Por favor completa Nombre, Apellido y Código de Unidad.');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            // 1. Retrieve Database from LocalStorage (Simulating checking "propietarios.xls" uploaded by Gatekeeper)
            const storedDBString = localStorage.getItem('community_owners_db');
            let dbToSearch: any[] = [];

            if (storedDBString) {
                dbToSearch = JSON.parse(storedDBString);
            } else {
                console.warn('No community DB found in localStorage, using fallback.');
                dbToSearch = FALLBACK_DB;
            }

            // 2. Logic: First find the Unit, THEN check Name + Lastname
            // This is safer than just checking name, to avoid homonyms in different apartments.
            const unitMatch = dbToSearch.find(u => {
                const dbUnitCode = `${u.torre}${u.apto}`; // Concatenate Torre and Apto from DB
                return dbUnitCode === formData.unitCode.trim();
            });

            if (!unitMatch) {
                setIsLoading(false);
                setError('No encontramos esa unidad (Torre/Apartamento) en el archivo de propietarios.');
                return;
            }

            // 3. Compare Names ignoring Case and Accents
            const inputName = normalizeText(formData.name);
            const inputLastname = normalizeText(formData.lastname);
            const dbName = normalizeText(unitMatch.name);
            const dbLastname = normalizeText(unitMatch.lastname);

            const isNameMatch = inputName === dbName && inputLastname === dbLastname;

            setIsLoading(false);

            if (isNameMatch) {
                // Pre-fill email/phone if found in DB (optional, but good UX)
                setFormData(prev => ({
                    ...prev,
                    email: unitMatch.email || prev.email,
                    phone1: unitMatch.tel1 || prev.phone1
                }));
                setStep(2);
            } else {
                setError(`La unidad existe, pero el propietario registrado es: ${unitMatch.name} ${unitMatch.lastname}. Sus datos no coinciden.`);
            }
        }, 2000); // Simulated delay for "reading file"
    };

    const createAccount = () => {
        // Validate Password (5 alphanumeric)
        const passwordRegex = /^[a-zA-Z0-9]{5}$/;
        if (!passwordRegex.test(credentials.password)) {
            setError('La clave debe ser alfanumérica y tener exactamente 5 caracteres.');
            return;
        }
        if (credentials.username.length < 3) {
            setError('El usuario debe tener al menos 3 caracteres.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            // Determine Role
            const role = ADMIN_EMAILS.includes(formData.email.toLowerCase()) ? 'ADMIN' : 'USER';

            // Save to LocalStorage (Simulate DB Create)
            const newUser = {
                ...formData,
                username: credentials.username,
                password: credentials.password,
                role: role
            };
            localStorage.setItem('resident_user', JSON.stringify(newUser));
            
            setIsLoading(false);
            setStep(3);
        }, 1000);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="flex items-center p-4 border-b border-gray-200 dark:border-white/5">
                <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="ml-4 text-lg font-bold text-slate-900 dark:text-white">Registro Propietario</h1>
            </header>

            <main className="flex-1 p-6">
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in space-y-5">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Validación de Identidad</h2>
                            <p className="text-gray-500 text-sm">El sistema validará tus datos con el archivo <strong>propietarios.xls</strong> de administración.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Nombres</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Como aparece en escrituras" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 text-sm"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Apellidos</label>
                                    <input name="lastname" value={formData.lastname} onChange={handleInputChange} type="text" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary text-sm"/>
                                </div>
                            </div>

                            {/* Campo de Código de Unidad */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Ubicación (Torre + Apartamento)</label>
                                <input 
                                    name="unitCode" 
                                    value={formData.unitCode} 
                                    onChange={handleInputChange} 
                                    type="number" 
                                    placeholder="Ej: 3102"
                                    className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 font-mono tracking-wider"
                                />
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex gap-2 items-start border border-blue-100 dark:border-blue-900/30">
                                    <span className="material-symbols-outlined text-blue-500 text-sm shrink-0 mt-0.5">database</span>
                                    <p className="text-xs text-blue-600 dark:text-blue-300">
                                        Se buscará en la columna "Torre" y "Apto" del archivo Excel.<br/>
                                        <strong>Ejemplo:</strong> Torre <strong>3</strong> Apto <strong>102</strong> = Escribe <strong>3102</strong>.
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Correo Electrónico (Actualización)</label>
                                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="registrado@administracion.com" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Teléfono 1</label>
                                    <input name="phone1" value={formData.phone1} onChange={handleInputChange} type="tel" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Teléfono 2</label>
                                    <input name="phone2" value={formData.phone2} onChange={handleInputChange} type="tel" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"/>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">cancel</span>
                                <span className="flex-1">{error}</span>
                            </div>
                        )}

                        <button 
                            onClick={verifyUser}
                            disabled={isLoading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                                    Consultando Base de Datos...
                                </>
                            ) : (
                                <>
                                    Validar Acceso
                                    <span className="material-symbols-outlined">search_check</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slide-up space-y-5">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Credenciales</h2>
                            <p className="text-gray-500 text-sm">Configura tu acceso a la aplicación.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined">verified_user</span>
                            <div className="text-sm">
                                <p className="font-bold">¡Identidad Confirmada!</p>
                                <p className="text-xs opacity-80">
                                    Propietario: {formData.name} {formData.lastname}<br/>
                                    Unidad: {formData.unitCode}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Usuario</label>
                                <input name="username" value={credentials.username} onChange={handleCredentialsChange} type="text" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Clave (5 Caracteres Alfanuméricos)</label>
                                <input name="password" value={credentials.password} onChange={handleCredentialsChange} maxLength={5} type="password" className="w-full rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary tracking-widest"/>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">Ejemplo: A1b2C</p>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                        )}

                        <button 
                            onClick={createAccount}
                            disabled={isLoading}
                            className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg mt-4"
                        >
                            {isLoading ? 'Creando...' : 'Finalizar Registro'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center justify-center text-center h-full pt-10 animate-fade-in">
                        <div className="size-24 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl">celebration</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¡Registro Exitoso!</h2>
                        <p className="text-gray-500 text-sm max-w-xs mb-8">
                            Tu cuenta ha sido creada correctamente. Ya puedes ingresar con tu usuario y clave.
                        </p>
                        <button 
                            onClick={() => navigate('/resident/login')}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl shadow-lg"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResidentRegisterScreen;