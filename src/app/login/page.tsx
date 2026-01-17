'use client';

import { Outfit } from "next/font/google";
import { useActionState } from "react";
import { signIn } from "../actions/login";
import Link from 'next/link';
import { Button } from "@headlessui/react";

const outfit = Outfit({ subsets: ['latin'] });

export default function Login() {
    const [state, action, pending] = useActionState(signIn, undefined);

    return (
        <div className={`flex min-h-[calc(100vh-80px)] items-center justify-center p-4 ${outfit.className}`}>
            <div className="glass w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 -left-1/2 w-full h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-neutral-400 text-sm font-medium">Sign in to access your dashboard</p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                            />
                            {state?.errors?.email && (
                                <p className="text-red-400 text-xs mt-2 font-medium ml-1">{state.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                            />
                            {state?.errors?.password && (
                                <p className="text-red-400 text-xs mt-2 font-medium ml-1">{state.errors.password}</p>
                            )}
                        </div>

                        {state?.message && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm text-center font-medium">{state.message}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={pending}
                            className={`w-full py-4 rounded-xl font-bold tracking-wide text-sm uppercase transition-all duration-300 shadow-lg shadow-blue-900/20 ${pending
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-[1.02] hover:shadow-blue-500/25'
                                }`}
                        >
                            {pending ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-neutral-400 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white hover:text-blue-400 font-bold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}