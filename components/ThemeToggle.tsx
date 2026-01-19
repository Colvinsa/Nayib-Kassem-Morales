
import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const currentTheme = document.documentElement.classList.contains('dark');
        setIsDark(currentTheme);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button 
            onClick={toggleTheme}
            className={`flex items-center justify-center size-10 rounded-full transition-all duration-300 ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-blue-600 hover:bg-black/10'} ${className}`}
            title={isDark ? "Cambiar a Modo Día" : "Cambiar a Modo Noche"}
        >
            <span className="material-symbols-outlined filled">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
    