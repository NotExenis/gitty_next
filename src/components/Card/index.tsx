import React from 'react';

import { Roboto_Mono } from 'next/font/google'

export const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
})

interface CardProps {
    heading: string;
}

const Card: React.FC<CardProps> = ({ heading }) => {

    return (
        <div
            className={roboto_mono.className + " flex items-center justify-center bg-neutral-800/75 rounded-lg shadow-lg w-28 h-10 text-white transition duration-100 ease-in hover:bg-neutral-700/50 hover:scale-105"}>
            {heading}
        </div>
    );
};

export default Card;