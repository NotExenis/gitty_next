import Link from "next/link";
import ChangelogFeed from "@/components/Changelog";
import { gettingcookie } from "@/app/layout"; // Importing the cookie logic

export default async function ChangelogPage() {
    // Determine role (server-side)
    const role = await gettingcookie();

    return (
        <main className="min-h-screen pt-24 px-4 md:px-8 pb-12 relative overflow-x-hidden">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] -z-20 pointer-events-none" />
            <div className="fixed top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] -z-10" />

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
                        <span className="rgb-flow-gradient">CHANGELOG</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base">
                        Stay informed about the latest improvements and fixes for Velocity.
                    </p>
                </div>

                <ChangelogFeed role={role} />
            </div>
        </main>
    );
}
