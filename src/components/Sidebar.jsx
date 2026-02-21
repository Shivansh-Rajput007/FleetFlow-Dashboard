import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    MapPin,
    Wrench,
    DollarSign,
    Users,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Cylinder
} from 'lucide-react';
import useStore from '../store/useStore';
import { ROLE_PERMISSIONS } from '../utils/constants';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout } = useStore();

    const menuItems = [
        { name: 'Command Center', path: '/', icon: LayoutDashboard, permission: 'dashboard' },
        { name: 'Vehicle Registry', path: '/vehicles', icon: Truck, permission: 'vehicles' },
        { name: 'Trip Dispatcher', path: '/trips', icon: MapPin, permission: 'trips' },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench, permission: 'maintenance' },
        { name: 'Expenses & Fuel', path: '/expenses', icon: DollarSign, permission: 'expenses' },
        { name: 'Drivers', path: '/drivers', icon: Users, permission: 'drivers' },
        { name: 'Analytics', path: '/analytics', icon: BarChart3, permission: 'analytics' },
    ];

    const userPermissions = ROLE_PERMISSIONS[user?.role] || [];
    const filteredMenu = menuItems.filter(item => userPermissions.includes(item.permission));

    return (
        <div className={`bg-gray-50 border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary-200 shrink-0">
                        <Cylinder size={24} className="animate-pulse" />
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-xl font-black tracking-tight text-slate-800 animate-fade-in whitespace-nowrap">Fleet<span className="text-primary-600">Flow</span></h1>
                    )}
                </div>
                {!isCollapsed && (
                    <button 
                        onClick={() => setIsCollapsed(true)}
                        className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
                {isCollapsed && (
                    <button 
                        onClick={() => setIsCollapsed(false)}
                        className="absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary-600 shadow-sm z-50 transition-all"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {filteredMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group
                            ${isActive
                                ? 'bg-primary-50 text-primary-700 font-bold'
                                : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm hover:translate-x-1'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={22} className={`shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {!isCollapsed && (
                                    <span className="text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                                )}
                                {isActive && (
                                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-600 rounded-r-full shadow-[2px_0_8px_rgba(30,64,175,0.4)]" />
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-bold uppercase tracking-widest shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-black border border-primary-200">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tighter">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-medium py-3 ${isCollapsed ? 'justify-center w-full px-0' : 'px-3 w-full'}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm">Logout System</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
