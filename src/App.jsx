import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import AttendancePage from './components/AttendancePage';
import EmployeesPage from './components/EmployeesPage';
import SettingsPage from './components/SettingsPage';
import { 
  initialAdminData, 
  initialAttendanceRecords, 
  initialEmployeesData 
} from './data/mockData';
import { Menu, LogIn, Monitor } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentTab, setCurrentTab] = useState('attendance'); // 'attendance', 'employees', 'settings'
  const [adminData, setAdminData] = useState(initialAdminData);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceRecords);
  const [employeesData, setEmployeesData] = useState(initialEmployeesData);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If not logged in, render the login page
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentTab('attendance');
        }} 
      />
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        adminData={adminData}
        onLogout={() => setIsAuthenticated(false)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Mobile Header Bar */}
        <header className="mobile-top-bar">
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} />
          </button>
          <div className="mobile-brand-title">Login Rek</div>
          <button 
            className="mobile-quick-switch"
            onClick={() => setIsAuthenticated(false)}
            title="Ke Halaman Login"
          >
            <LogIn size={18} />
          </button>
        </header>


        {/* Dynamic Main Body Content */}
        <main className="dashboard-main-body">
          {currentTab === 'attendance' && (
            <AttendancePage 
              attendanceData={attendanceData} 
              employeesData={employeesData}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesPage 
              employeesData={employeesData} 
              setEmployeesData={setEmployeesData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage 
              adminData={adminData} 
              setAdminData={setAdminData} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
