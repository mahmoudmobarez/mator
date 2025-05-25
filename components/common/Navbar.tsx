
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserIcon from '../icons/UserIcon';
import MapPinIcon from '../icons/MapPinIcon';
import WalletIcon from '../icons/WalletIcon';
import HistoryIcon from '../icons/HistoryIcon';
import ChatBubbleIcon from '../icons/ChatBubbleIcon'; // For Support
import BellIcon from '../icons/BellIcon';
import { BRAND_COLORS } from '../../constants';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center p-2 w-1/5 ${active ? `text-yellow-400` : `text-slate-400 hover:text-yellow-400`} transition-colors`}>
    {icon}
    <span className={`text-xs mt-1 ${active ? 'font-semibold' : ''}`}>{label}</span>
  </Link>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === "/home" && location.pathname.startsWith("/home"));

  const navItems = [
    { to: "/home", icon: <MapPinIcon className="w-6 h-6" />, label: "Home" },
    { to: "/history", icon: <HistoryIcon className="w-6 h-6" />, label: "History" },
    { to: "/wallet", icon: <WalletIcon className="w-6 h-6" />, label: "Wallet" },
    { to: "/notifications", icon: <BellIcon className="w-6 h-6" />, label: "Alerts" }, // Added notifications
    { to: "/profile", icon: <UserIcon className="w-6 h-6" />, label: "Profile" }, // Profile can include support link or be separate
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-lg flex justify-around items-center h-16 z-50">
      {navItems.map(item => (
        <NavItem key={item.to} {...item} active={isActive(item.to)} />
      ))}
    </nav>
  );
};

export default Navbar;
    