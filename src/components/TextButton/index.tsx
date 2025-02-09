import React from 'react';

import { Roboto_Mono } from 'next/font/google'

export const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
})

interface CardProps {
    heading: string;
}

const TextButton: React.FC<CardProps> = ({ heading }) => {

    return (
        <div
            className={roboto_mono.className + " flex items-center justify-center bg-black/20 border-[1px] border-black/0 rounded-lg shadow-lg shadow-neutral-900 w-[120px] h-10 text-white text-xs transition duration-200 ease-in-out hover:bg-neutral-700/40 hover:scale-105 hover:border-neutral-300/10"}>
            {heading}
        </div>
    );
};

export default TextButton;