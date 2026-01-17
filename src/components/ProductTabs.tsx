'use client';

import React, { useState } from 'react';
import { ProductToken } from '../../interfaces/interfaces';
import TokenList from "@/components/TokenList";
import { FaKey, FaComments, FaInfoCircle } from 'react-icons/fa';

interface ProductTabsProps {
    product: {
        id: string;
        name: string;
        description: string;
        details?: Array<{ title: string; content: string[]; icon?: string }>;
        image?: string;
        price?: number;
    };
    tokens: ProductToken[];
}

export default function ProductTabs({ product, tokens }: ProductTabsProps) {
    // Define available tabs based on product ID or other properties
    const availableTabs = [
        { id: 'licenses', label: 'Licenses', icon: FaKey },
        // So if product name is Tweaker, add "chat" to the available tabs
        ...(product.id === 'Tweaker' ? [{ id: 'chat', label: 'Agent Chat', icon: FaComments }] : []),
        { id: 'info', label: 'Product Info', icon: FaInfoCircle }, // Fallback to see info if needed
    ];

    const [activeTab, setActiveTab] = useState('licenses');

    return (
        <div className="w-full max-w-5xl mx-auto glass rounded-3xl overflow-hidden border border-white/10 min-h-[600px] flex flex-col">
            {/* Header / Tab Bar */}
            <div className="bg-black/20 border-b border-white/5 p-2 flex items-center gap-2 overflow-x-auto">
                {availableTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                                }`}
                        >
                            <tab.icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {activeTab === 'licenses' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                            <p className="text-zinc-400">Manage your active licenses for this product.</p>
                        </div>
                        <TokenList tokens={tokens} />
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4">
                            <FaComments size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Tweaker Chat</h3>
                        <p className="text-zinc-500 max-w-md">
                            Chat for tweaker shit
                        </p>
                        <button className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors">
                            Launch Chat
                        </button>
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">About this Product</h2>
                        <div className="prose prose-invert">
                            <p className="text-lg text-zinc-300 leading-relaxed mb-8">{product.description}</p>
                            {product.details && (
                                <div className="space-y-4">
                                    {product.details.map((detail, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <h4 className="font-bold text-white mb-2">{detail.title}</h4>
                                            <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                                                {detail.content.map((line: string, j: number) => (
                                                    <li key={j}>{line}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
