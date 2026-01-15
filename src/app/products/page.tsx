import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";

// Mock Data
// Mock Data
export const products = [
    {
        id: "billboards",
        name: "Billboards",
        description: "Extremely good way of making your server more customized and unique.",
        details: [
            {
                title: "Overview",
                content: ["A light-weight billboards plugin providing minimized load towards the server, ensuring high quality video or image display."],
                icon: "info"
            },
            {
                title: "Features",
                content: ["Wish to display maps, images, gifs or even advertisements? Then this is a perfect solution."],
                icon: "star"
            },
            {
                title: "Compatibility",
                content: ["Supporting versions 1.8 - 1.21"],
                icon: "server"
            }
        ],
        price: 19.99,
        image: "/velocity.png"
    },
    {
        id: "calendars",
        name: "Calendar",
        description: "A simple calendars plugin for your server.",
        details: [
            {
                title: "Engagement",
                content: ["Improve player activity by unlocking a reward each day making players log on and redeem them."],
                icon: "chart"
            },
            {
                title: "Features",
                content: [
                    "Menu supported, able to switch item states if the reward is locked, available or redeemed.",
                    "Create as many versions of it as you want, calendar for each month, holiday, etc."
                ],
                icon: "check"
            },
            {
                title: "Compatibility",
                content: ["Supporting version 1.8 - 1.21"],
                icon: "server"
            }
        ],
        price: 9.99,
        image: "/velocity.png"
    },
    {
        id: "spawners",
        name: "Spawners",
        description: "Everything you need for spawners and mobs, fully customizable and developer-friendly.",
        details: [
            {
                title: "Core Features",
                content: ["All in one stacked spawners, mob drops & mob stacking."],
                icon: "box"
            },
            {
                title: "Customization",
                content: [
                    "Plugin is fully configurable, supports grouped spawners, custom entities and custom spawners.",
                    "Has built-in spawner stacking, advanced configurable mob stacking and custom drops with averaging system."
                ],
                icon: "check"
            },
            {
                title: "Developer API",
                content: [
                    "Developer ready, contains flexible API for full control, supports custom SpawnerTypes, entities, drops and logic.",
                    "Has easy integration with any mobs or bosses plugin and an extensive event system for total flexibility."
                ],
                icon: "code"
            },
            {
                title: "Compatibility",
                content: ["Supports versions 1.8 - 1.20"],
                icon: "server"
            }
        ],
        price: 19.99,
        image: "/velocity.png"
    },
    {
        id: "hypebox",
        name: "Hypeboxes",
        description: "Crates plugin that features single openings, spectating, player battles / AI battles where winner takes all and more!.",
        details: [
            {
                title: "Overview",
                content: ["Crates plugin that features single openings, spectating, player battles / AI battles where winner takes all and more!"],
                icon: "info"
            },
            {
                title: "Features",
                content: [
                    "Customizable animations, in-game editable rewards and chances, customizable sound effects and fully configurable menus."
                ],
                icon: "star"
            },
            {
                title: "Compatibility",
                content: ["Supporting 1.8 - 1.21 versions."],
                icon: "server"
            }
        ],
        price: 19.99,
        image: "/velocity.png"
    },
    {
        id: "masks",
        name: "Masks",
        description: "The most advanced masks progression system for minecraft.",
        details: [
            {
                title: "System",
                content: ["The most advanced masks progression system for minecraft."],
                icon: "shield"
            },
            {
                title: "Features",
                content: [
                    "Contains powerful custom effects, dynamic progression and a full developer API.",
                    "Level-based progression with missions, level inheritance for efficient configs, mathematical formulas for mission goals, event systems and more"
                ],
                icon: "star"
            },
            {
                title: "Developer API",
                content: [
                    "Create custom masks programmatically.",
                    "Create custom effects (extend MaskEffect)",
                    "Create custom missions (extend MissionType)",
                    "Full event listener support",
                    "Builder patterns for easy creation"
                ],
                icon: "code"
            },
            {
                title: "Compatibility",
                content: ["Supporting 1.8 - 1.21 versions."],
                icon: "server"
            }
        ],
        price: 19.99,
        image: "/velocity.png"
    }
];

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
