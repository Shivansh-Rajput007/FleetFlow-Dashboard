import React from 'react';
import { twMerge } from 'tailwind-merge';
import EmptyState from './EmptyState';

const Table = ({ columns, data, className, emptyTitle, emptyDescription }) => {
    return (
        <div className={twMerge("overflow-x-auto", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-8 py-5 text-sm font-medium text-slate-600"
                                    >
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4">
                                <EmptyState title={emptyTitle} description={emptyDescription} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
