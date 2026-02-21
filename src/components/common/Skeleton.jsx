import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className }) => {
    return (
        <div className={twMerge("animate-pulse bg-slate-200 rounded-lg", className)}></div>
    );
};

export default Skeleton;
