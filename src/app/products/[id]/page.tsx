import { products } from "../page";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaShoppingCart, FaCheck, FaServer, FaCode, FaChartLine, FaBox, FaShieldAlt, FaStar, FaInfoCircle } from "react-icons/fa";
import { getUserTokens } from "@/app/actions/products";
import ProductTabs from "@/components/ProductTabs";
import CheckoutButton from "@/components/CheckoutButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In a real app, fetch data based on params.id
    // This server component can be async
    const product = products.find(p => p.id === id);

    // Fetch tokens for this product
    const tokens = await getUserTokens(id);

    // Fallback logic for unknown products (if user owns them)
    let displayProduct = product;
    if (!displayProduct) {
        if (tokens.length > 0) {
            displayProduct = {
                id: id,
                name: id,
                description: "Product details not available in catalog.",
                price: 0,
                image: "/velocity.png",
                details: []
            };
        }
    }

    if (!displayProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <Link href="/products" className="text-blue-400 hover:underline">Return to Products</Link>
            </div>
        );
    }

    // If user OWNS the product (has tokens), use the Dashboard/Tabbed Layout
    if (tokens.length > 0) {
        return (
            <main className="min-h-screen px-8 pt-28 pb-12 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] -z-20 pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />

                <div className="w-full max-w-5xl mx-auto mb-8 flex items-center gap-4">
                    <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                        <FaArrowLeft size={16} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">{displayProduct.name}</h1>
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Owned</span>
                        </div>
                    </div>
                </div>

                <ProductTabs product={displayProduct} tokens={tokens} />
            </main>
        );
    }

    // Otherwise, Standard Purchase Layout
    return (
        <main className="min-h-screen px-8 pt-28 pb-24 relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] -z-20 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <Link href="/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Products</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                    {/* Left: Visual */}
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 p-2 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                <Image
                                    src={displayProduct.image}
                                    alt={displayProduct.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info & CTA */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                            {displayProduct.name}
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed mb-8 border-l-2 border-blue-500/50 pl-6">
                            {displayProduct.description}
                        </p>

                        <div className="flex flex-col gap-6 mb-10">
                            <FeatureRow text="Instant Delivery" />
                            <FeatureRow text="24/7 Support Access" />
                            <FeatureRow text="Lifetime Updates" />
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-zinc-400 text-sm font-medium mb-1">One-time purchase</p>
                                    <div className="text-4xl font-bold text-white">${displayProduct.price}</div>
                                </div>
                            </div>

                            <CheckoutButton
                                productId={displayProduct.id}
                                productName={displayProduct.name}
                                price={displayProduct.price}
                            />
                        </div>
                    </div>
                </div>

                {/* Details Grid Section */}
                {displayProduct.details && displayProduct.details.length > 0 && (
                    <div className="border-t border-white/10 pt-24">
                        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                            Features & Specifications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayProduct.details.map((detail: { title: string; content: string[]; icon?: string }, index: number) => (
                                <div key={index} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-1 duration-300">
                                    <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-white/5">
                                        {/* Dynamic Icon Rendering */}
                                        {detail.icon === 'server' && <FaServer size={20} />}
                                        {detail.icon === 'code' && <FaCode size={20} />}
                                        {detail.icon === 'chart' && <FaChartLine size={20} />}
                                        {detail.icon === 'box' && <FaBox size={20} />}
                                        {detail.icon === 'shield' && <FaShieldAlt size={20} />}
                                        {detail.icon === 'star' && <FaStar size={20} />}
                                        {detail.icon === 'check' && <FaCheck size={20} />}
                                        {detail.icon === 'info' && <FaInfoCircle size={20} />}
                                        {!detail.icon && <FaInfoCircle size={20} />}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-4">{detail.title}</h3>

                                    <ul className="space-y-3">
                                        {detail.content.map((line: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
                                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                                                {line}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function FeatureRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-zinc-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs shrink-0">
                <FaCheck size={10} />
            </div>
            <span className="font-medium">{text}</span>
        </div>
    )
}
