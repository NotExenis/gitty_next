import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";

import { products } from "@/data/products";
export default function ProductsPage() {
    return (
        <main className="min-h-screen pt-24 px-8 pb-12 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
            <div className="fixed bottom-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-float">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-gradient-to-b">
                        <span className="rgb-flow-gradient">PRODUCTS</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto text-balance">
                        Equip your server with the industry standard. High performance, reliable, and battle-tested solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="group">
                            <div className="glass h-full p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 relative overflow-hidden flex flex-col">
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="h-40 w-full bg-black/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <h3 className="text-xl font-bold text-white/90 mb-2 group-hover:text-white transition-colors">
                                        {product.name}
                                    </h3>

                                    <p className="text-zinc-500 text-sm mb-6 flex-grow leading-relaxed group-hover:text-zinc-400 transition-colors">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                        <span className="text-2xl font-bold text-white/90">
                                            ${product.price}
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg">
                                            <FaShoppingCart size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
