import { products } from "../page";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaShoppingCart, FaCheck, FaServer, FaCode, FaChartLine, FaBox, FaShieldAlt, FaStar, FaInfoCircle } from "react-icons/fa";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    // In a real app, fetch data based on params.id
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <Link href="/products" className="text-blue-400 hover:underline">Return to Products</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen px-8 pb-24 relative overflow-hidden flex items-center justify-center">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />

            <div className="glass max-w-5xl w-full p-8 md:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-12 border border-white/10 md:items-center relative">

                {/* Back Button */}
                <Link href="/products" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors">
                    <FaArrowLeft size={20} />
                </Link>

                {/* Left: Image/Visual */}
                <div className="aspect-square bg-gradient-to-br from-black/40 to-black/20 rounded-2xl border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                    <div className="relative w-full h-full scale-100 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex flex-col h-full justify-center">
                    <div className="mb-8">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-500/20">
                            Digital License
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white/95 mb-4 tracking-tight">
                            {product.name}
                        </h1>
                        {/* Structured Details */}
                        <div className="space-y-8">
                            {product.details?.map((detail: any, index: number) => (
                                <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                        {detail.icon === 'server' && <FaServer className="text-blue-400" />}
                                        {detail.icon === 'code' && <FaCode className="text-purple-400" />}
                                        {detail.icon === 'chart' && <FaChartLine className="text-green-400" />}
                                        {detail.icon === 'box' && <FaBox className="text-orange-400" />}
                                        {detail.icon === 'shield' && <FaShieldAlt className="text-red-400" />}
                                        {detail.icon === 'star' && <FaStar className="text-yellow-400" />}
                                        {detail.icon === 'check' && <FaCheck className="text-green-400" />}
                                        {detail.icon === 'info' && <FaInfoCircle className="text-blue-300" />}
                                        <span>{detail.title}</span>
                                    </h3>
                                    <div className="space-y-2 text-zinc-400 leading-relaxed">
                                        {detail.content.map((line: string, i: number) => (
                                            <p key={i} className="flex gap-2">
                                                <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                                                <span>{line}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Fallback for old data if any (or just description if details missing) */}
                            {!product.details && (
                                <p className="text-lg text-zinc-400 leading-relaxed text-balance">
                                    {product.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <FeatureRow text="Instant Delivery" />
                        <FeatureRow text="24/7 Support Access" />
                        <FeatureRow text="Lifetime Updates" />
                    </div>

                    <div className="flex items-center gap-6 mt-auto">
                        <div className="text-4xl font-bold text-white/90">
                            ${product.price}
                        </div>
                        <button className="flex-1 bg-white text-black font-bold h-14 rounded-full hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            <FaShoppingCart />
                            <span>Purchase Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function FeatureRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-zinc-500">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">
                <FaCheck />
            </div>
            <span className="text-sm font-medium">{text}</span>
        </div>
    )
}
