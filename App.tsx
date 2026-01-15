
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import GenerateQRScreen from './screens/GenerateQRScreen';
import GatekeeperScreen from './screens/GatekeeperScreen';
import NewRequestScreen from './screens/NewRequestScreen';
import RequestsScreen from './screens/RequestsScreen';
import AdminPQRScreen from './screens/AdminPQRScreen';
import ReservationScreen from './screens/ReservationScreen';
import LoginScreen from './screens/LoginScreen';
import AdminPaymentsScreen from './screens/AdminPaymentsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import LandingScreen from './screens/LandingScreen';
import ResidentRegisterScreen from './screens/ResidentRegisterScreen';
import ResidentLoginScreen from './screens/ResidentLoginScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import AdminNoticesScreen from './screens/AdminNoticesScreen';
import SettingsScreen from './screens/SettingsScreen';
import FinancialDashboardScreen from './screens/FinancialDashboardScreen';
import AdminFinancialsScreen from './screens/AdminFinancialsScreen';
import DevMenu from './components/DevMenu';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen w-full flex justify-center bg-black/10">
        <div className="w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl min-h-screen relative flex flex-col">
          {/* El DevMenu ahora es absoluto respecto a este contenedor */}
          <DevMenu />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/resident/register" element={<ResidentRegisterScreen />} />
              <Route path="/resident/login" element={<ResidentLoginScreen />} />
              
              <Route path="/admin/panel" element={<AdminPanelScreen />} />
              <Route path="/admin/notices" element={<AdminNoticesScreen />} />
              <Route path="/admin/financials" element={<AdminFinancialsScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/admin/payments" element={<AdminPaymentsScreen />} />
              <Route path="/payments" element={<PaymentsScreen />} />
              <Route path="/financial-dashboard" element={<FinancialDashboardScreen />} />
              <Route path="/generate-qr" element={<GenerateQRScreen />} />
              <Route path="/gatekeeper" element={<GatekeeperScreen />} />
              <Route path="/new-request" element={<NewRequestScreen />} />
              <Route path="/requests" element={<RequestsScreen />} />
              <Route path="/admin/pqr" element={<AdminPQRScreen />} />
              <Route path="/reservations" element={<ReservationScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </div>
          
          <footer className="w-full py-8 px-6 text-center border-t border-gray-200/50 dark:border-white/5 mt-auto">
             <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 leading-relaxed">
                elaborado por Nayib Kassem<br/>
                software libre piloto para puerto azul en espera de su aprobación
             </p>
          </footer>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
