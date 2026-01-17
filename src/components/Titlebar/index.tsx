'use client';

import Image from 'next/image';
import velocityLogo from '../../../public/velocity.png';

import { VscAccount } from "react-icons/vsc";
import Link from "next/link";
import TextButton from "../TextButton";
import React from 'react'; // Ensure React is imported
import {
    adminNavigation,
    guestNavigation,
    userNavigation,
} from "../../utils/navigation.ts";
import { logout } from '@/app/actions/logout';

const Titlebar: React.FC<{ role: string }> = (r) => {

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

    // State for dropdown
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = async () => {
        await logout();
    };

    const currentNavigation = getNavigationForRole(role);
    const isGuest = !role || role === 'guest';

    return (
        <nav className="glass sticky top-0 z-50 flex items-center justify-between pl-8 pr-0 h-20 w-full"
            style={{ ['WebkitAppRegion' as string]: 'drag' }}>

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

            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row gap-8 z-10">
                {currentNavigation.map((item) => {
                    return (
                        <Link key={item.name} href={item.href} className="flex justify-center items-center">
                            <TextButton heading={item.name} />
                        </Link>
                    )
                })}
            </div>

            {/* Account Section */}
            <div className="h-full flex items-center">
                {isGuest ? (
                    <Link
                        href="/login"
                        className="h-full px-10 flex items-center justify-center gap-4 hover:bg-white/10 transition-all border-l border-white/5 cursor-pointer"
                        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                    >
                        <VscAccount size={28} className="text-white/90" />
                        <span className="text-white font-bold text-lg tracking-wider">LOGIN</span>
                    </Link>
                ) : (
                    <div className="relative h-full" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`h-full px-10 flex items-center justify-center gap-4 transition-all border-l border-white/5 cursor-pointer ${isOpen ? 'bg-white/15' : 'hover:bg-white/10'}`}
                            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                        >
                            <VscAccount size={28} className="text-white/90" />
                            <span className="text-white font-bold text-lg tracking-wider uppercase">ACCOUNT</span>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute top-full right-0 w-56 bg-black/95 backdrop-blur-xl border-l border-b border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-1">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-left px-6 py-4 text-base text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-6 py-4 text-base text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Titlebar;
