import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import Badge from '../components/common/Badge';

const DashboardLayout = () => {
    const { user, logout } = useStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} flex flex-col`}>
                {/* Top Navbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm transition-all">
                    <div className="flex items-center gap-4 bg-slate-100/50 border border-slate-100 px-4 py-2 rounded-xl w-96 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/30 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search fleet, trips, or drivers..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            <span className="sr-only">Notifications</span>
                        </button>
                        
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold border border-primary-100/50 shadow-inner group-hover:bg-primary-100 transition-colors">
                                    {user?.name?.charAt(0) || <User size={20} />}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    <Badge variant="info" className="scale-[0.8] origin-left -mt-1 uppercase tracking-tighter opacity-80">{user?.role}</Badge>
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-0" 
                                        onClick={() => setIsUserMenuOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in-up">
                                        <div className="px-3 py-2 border-b border-slate-50 mb-1 sm:hidden">
                                            <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                            <p className="text-xs text-slate-500">{user?.role}</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
                                        >
                                            <LogOut size={18} />
                                            Logout from System
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-10 flex-1 max-w-[1600px] w-full mx-auto">
                    <div className="animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
