'use client';

import React from "react";

const Card: React.FC<{ width: string; height: string; children: React.ReactNode }> = ({ width, height, children }) => {
    return (
        <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="flex flex-col bg-neutral-900/80 border-2 border-neutral-600/50 shadow-lg shadow-neutral-900 rounded-xl"
        >
            {children}
        </div>
    );
};

export default Card;