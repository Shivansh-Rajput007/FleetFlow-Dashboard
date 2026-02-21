import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Environment</span>
                        <Badge variant="info">Production</Badge>
                    </div>
                </header>
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
