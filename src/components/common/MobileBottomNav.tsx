import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Calendar, MapPin, Send, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileBottomNav() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { label: 'Explore', path: '/', icon: Compass },
    { label: 'Plan', path: '/plan', icon: Calendar },
    { label: 'Trips', path: '/trips', icon: MapPin },
    { label: 'Telegram', path: '/telegram', icon: Send },
    ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: Shield }] : [])
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE9FE] px-2 py-1.5 flex items-center justify-around shadow-wayfarer-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              active
                ? 'text-[#6D28D9] font-medium'
                : 'text-[#6B6385] hover:text-[#1F1637]'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
