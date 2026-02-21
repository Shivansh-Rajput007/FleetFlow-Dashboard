import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconRight = false,
    className,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md active:scale-[0.98]',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm hover:shadow-md active:scale-[0.98]',
        outline: 'bg-transparent border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md active:scale-[0.98]',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium',
        md: 'px-5 py-2.5 text-sm font-medium',
        lg: 'px-6 py-3 text-base font-medium',
    };

    return (
        <button
            className={twMerge(
                "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:ring-4 focus:ring-primary-600/10",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && !iconRight && <Icon size={size === 'sm' ? 14 : 18} />}
                    {children}
                    {Icon && iconRight && <Icon size={size === 'sm' ? 14 : 18} />}
                </>
            )}
        </button>
    );
};

export default Button;
