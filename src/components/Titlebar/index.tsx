'use client';

import Image from 'next/image';
import velocityLogo from '../../../public/velocity.png';

import { VscAccount } from "react-icons/vsc";
import { Button } from "@headlessui/react";
import Link from "next/link";
import TextButton from "../TextButton";
import {
    adminNavigation,
    guestNavigation,
    userNavigation,
} from "../../utils/navigation.ts";

const Titlebar: React.FC<{role: string}> = (r) => {

    const role = r?.role;
    const navigationItems = {
        guest: guestNavigation,
        user: userNavigation,
        admin: adminNavigation,
    };

    const getNavigationForRole = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return navigationItems.admin;
            case "user":
                return navigationItems.user;
            default:
                return navigationItems.guest;
        }
    };

    const accountHandle = () => {
        // TODO: check if logged in, if not route to /login otherwise do a dropdown menu
    }

    const currentNavigation = getNavigationForRole(role);
    return (
        <nav className="glass sticky top-0 z-50 flex items-center justify-between px-8 h-20 w-full"
             style={{['WebkitAppRegion' as string]: 'drag'}}>

            <div className="flex items-center gap-4">
                <Image src={velocityLogo} quality={100} className='w-[50px] h-[50px] drop-shadow-lg' alt='Velocity Logo' />
                <div className="relative group">
                    <span className="rgb-flow-gradient absolute inset-0 blur-lg opacity-70 select-none">
                        VELOCITY DEVELOPMENT
                    </span>
                    <h1 className="rgb-flow-gradient relative text-2xl font-black tracking-wide select-none">
                        VELOCITY DEVELOPMENT
                    </h1>
                </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row gap-8">
                {currentNavigation.map((item) => {
                    return (
                        <Link key={item.name} href={item.href} className="flex justify-center items-center">
                            <TextButton heading={item.name} />
                        </Link>
                    )
                })}
            </div>

            <Button onClick={accountHandle} className="flex items-center justify-center gap-3 px-6 h-12 rounded-full glass glass-hover transition-all group">
                <VscAccount size={24} className="text-white/80 group-hover:text-white transition-colors" />
                <span className="text-white/90 font-bold text-sm tracking-wider group-hover:text-white transition-colors">ACCOUNT</span>
            </Button>
        </nav>
    );
};

export default Titlebar;
