'use client';

import React, { useState } from 'react';
import { ProductToken } from '../../interfaces/interfaces';
import { FaCopy, FaEye, FaEyeSlash, FaClock } from 'react-icons/fa';

interface TokenListProps {
    tokens: ProductToken[];
}

export default function TokenList({ tokens }: TokenListProps) {
    const [visibleTokens, setVisibleTokens] = useState<Record<number, boolean>>({});

    const toggleVisibility = (id: number) => {
        setVisibleTokens(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    if (tokens.length === 0) return null;

    return (
        <div className="mt-8 pt-8 border-t border-white/10 w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-4">
                {tokens.map((token) => {
                    const isVisible = visibleTokens[token.id];

                    return (
                        <div key={token.id} className="glass p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">License Key</span>
                                        <div className="flex items-center gap-3">
                                            <code className="bg-black/40 px-3 py-1.5 rounded-lg text-sm font-mono text-white/90 border border-white/5">
                                                {isVisible ? token.token : '•'.repeat(24)}
                                            </code>

                                            <button
                                                onClick={() => toggleVisibility(token.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                title={isVisible ? "Hide" : "Show"}
                                            >
                                                {isVisible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                            </button>

                                            <button
                                                onClick={() => copyToClipboard(token.token)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                title="Copy to Clipboard"
                                            >
                                                <FaCopy size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${token.is_used ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        <div className={`w-2 h-2 rounded-full ${token.is_used ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                                        {token.is_used ? 'ACTIVE / USED' : 'UNUSED'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <FaClock />
                                        <span>Duration: <span className="text-zinc-300">{token.duration}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
