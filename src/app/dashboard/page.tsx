import { getOwnedProducts } from "../actions/products";
import { products } from "../products/page"; // Import static product list
import Link from "next/link";
import Image from "next/image";
import { FaCrown, FaArrowRight, FaBoxOpen } from "react-icons/fa";

export default async function Dashboard() {
    const ownedProductIds = await getOwnedProducts();

    // Filter the full product list to find details for owned products
    // Also handle cases where a user owns a product ID not in our static list (fallback)
    const ownedProducts = ownedProductIds.map(id => {
        const product = products.find(p => p.id.toLowerCase() === id.toLowerCase() || p.name.toLowerCase() === id.toLowerCase());
        if (product) return { ...product, originalId: id };
        return {
            id: id,
            name: id,
            description: "Product details unavailable.",
            image: "/velocity.png", // Fallback
            originalId: id
        };
    });

    return (
        <main className="min-h-screen pt-24 px-8 pb-12 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] -z-20 pointer-events-none" />
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Dashboard</h1>
                    <p className="text-zinc-400">Manage your licenses and products.</p>
                </div>

                {ownedProducts.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaCrown className="text-yellow-400" />
                            Your Products
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ownedProducts.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id} className="group">
                                    <div className="glass p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/5 relative overflow-hidden h-full flex flex-col">
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="w-12 h-12 bg-black/30 rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">{product.name}</h3>
                                                <div className="text-xs text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    Purchased
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-zinc-500 text-sm mb-6 flex-grow line-clamp-2">{product.description}</p>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                                            <span>Manage Licenses</span>
                                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="glass p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 mb-6">
                            <FaBoxOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                        <p className="text-zinc-400 max-w-md mb-8">You dont have any products yet. Browse our store to get started.</p>
                        <Link href="/products" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25">
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}