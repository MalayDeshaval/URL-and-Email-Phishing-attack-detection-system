import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Mail, 
  History, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/scan-url', icon: Globe, label: 'URL Scanner' },
    { to: '/scan-email', icon: Mail, label: 'Email Scanner' },
    { to: '/history', icon: History, label: 'Scan History' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-cyber-card border-r border-cyber-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="text-cyber-neon w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-white">PhishGuard <span className="text-cyber-neon">AI</span></span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-cyber-primary bg-opacity-20 text-cyber-neon border border-cyber-primary border-opacity-30' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-cyber-border">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-cyber-danger hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
