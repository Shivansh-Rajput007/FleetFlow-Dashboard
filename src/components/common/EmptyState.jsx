import React from 'react';
import { SearchX } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title = "No data found", description = "Try adjusting your filters or search terms.", icon: Icon = SearchX, actionLabel, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 border-dashed animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto font-medium">{description}</p>
            {actionLabel && (
                <Button variant="secondary" size="sm" onClick={onAction} className="mt-6">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
