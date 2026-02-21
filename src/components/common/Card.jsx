import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, title, subtitle, icon: Icon, actions, className }) => {
    return (
        <div className={twMerge(
            "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1",
            className
        )}>
            {(title || subtitle || Icon || actions) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                <Icon size={20} />
                            </div>
                        )}
                        <div>
                            {title && <h3 className="font-bold text-slate-800 leading-tight">{title}</h3>}
                            {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
                        </div>
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

export default Card;
