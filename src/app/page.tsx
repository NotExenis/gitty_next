import Link from "next/link";
import { FaRocket, FaCode, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10" />

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-12">

        {/* Hero Section */}
        <div className="text-center flex flex-col items-center gap-6 animate-float">
          <div
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-blue-200 text-xs font-semibold tracking-wider uppercase mb-4">
            NEW PRODUCTS AVAILABLE
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-gradient-to-b text-white">
            <span className="rgb-flow-gradient">VELOCITY</span>
          </h1>

          <p className="max-w-[600px] text-zinc-400 text-lg md:text-xl text-balance leading-relaxed">
            Premium development solutions tailored for high-performance environments.
            Experience the future of speed and reliability.
          </p>

          <div className="flex gap-4 mt-8">
            <Link href="/products"
                  className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
            <Link href="/about"
                  className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm">
              Learn More
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
          <FeatureCard
            icon={<FaRocket className="text-3xl text-blue-400" />}
            title="High Performance"
            desc="Optimized for maximum speed and efficiency in every operation."
          />
          <FeatureCard
            icon={<FaCode className="text-3xl text-purple-400" />}
            title="Clean Code"
            desc="Built with modern standards and maintainability in mind."
          />
          <FeatureCard
            icon={<FaShieldAlt className="text-3xl text-cyan-400" />}
            title="Secure Core"
            desc="Advanced security protocols to keep your data safe."
          />
        </div>

      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md hover:bg-white/5 transition-colors group cursor-default">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white/90">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
