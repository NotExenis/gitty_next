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
            className={roboto_mono.className + " flex items-center justify-center px-6 py-2 bg-white/5 backdrop-blur-sm border border-white/5 rounded-full text-white/90 text-xs tracking-wider font-semibold transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"}>
            {heading}
        </div>
    );
};

export default TextButton;