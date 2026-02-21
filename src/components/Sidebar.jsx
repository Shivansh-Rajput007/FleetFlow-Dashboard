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
    LogOut
} from 'lucide-react';
import useStore from '../store/useStore';
import { ROLE_PERMISSIONS } from '../utils/constants';

const Sidebar = () => {
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
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-xl">F</div>
                <h1 className="text-xl font-bold tracking-tight">FleetFlow</h1>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 w-full transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
