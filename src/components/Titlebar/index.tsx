'use client';

import Image from 'next/image';
import velocityLogo from '../../../public/velocity.png';

import { VscAccount } from "react-icons/vsc";
import { Button } from "@headlessui/react";
import Link from "next/link";
import TextButton from "../TextButton";

const Titlebar: React.FC = () => {

    const accountHandle = () => {
        // TODO: check if logged in, if not route to /login otherwise do a dropdown menu
    }

    return (
        <nav className="flex items-center justify-between bg-black/50 shadow-md shadow-neutral-900/75 h-20"
             style={{['WebkitAppRegion' as string]: 'drag'}}>

            <div className="flex items-center space-x-5">
                <Image src={velocityLogo} quality={100} layout="intrinsic" className='ml-4 w-[60px] h-[60px]' alt=''></Image>
                <div>
                    <span className="rgb-flow-gradient absolute mx-auto flex border bg-gradient-to-r blur-xl from-sky-600 via-sky-300 to-sky-600 bg-clip-text text-2xl font-extrabold box-content text-transparent select-none">
                        VELOCITY DEVELOPMENT
                    </span>
                    <h1 className="rgb-flow-gradient relative top-0 h-auto flex bg-gradient-to-r from-sky-600 via-sky-300 to-sky-600 bg-clip-text text-2xl font-extrabold text-transparent select-auto">
                        VELOCITY DEVELOPMENT
                    </h1>
                </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row space-x-14">
                <Link href="/" className="flex justify-center items-center">
                    <TextButton heading="HOME" />
                </Link>
                <Link href="/products" className="flex justify-center items-center">
                    <TextButton heading="PRODUCTS" />
                </Link>
                <Link href="/changelog" className="flex g justify-center items-center">
                    <TextButton heading="CHANGELOG" />
                </Link>
            </div>

            <Button onClick={accountHandle} className="flex flex-row right-0 items-center justify-center space-x-5 h-full w-52 transition duration-300 ease-in-out hover:bg-neutral-700/50">
                <VscAccount size={40} className="text-white"></VscAccount>
                <p className="text-white font-extrabold text-xl">ACCOUNT</p>
            </Button>
        </nav>
    );
};

export default Titlebar;
