import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'secondary', className }) => {
    const variants = {
        success: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-orange-100 text-orange-700 border-orange-200',
        danger: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    };

    return (
        <span className={twMerge(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
