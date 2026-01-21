import { motion } from "framer-motion";
import {
    Link2,
    FileText,
    FolderSearch,
    Search,
    Lock,
    ArrowRight,
    ShieldCheck,
    Globe,
    Database,
    Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300 backdrop-blur-sm"
    >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

export default function LandingPage({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans selection:text-blue-200 overflow-x-hidden">
            {/* Mesh Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] md:w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[80px] md:blur-[120px]" />
            </div>

            {/* Navigation */}
            <Navbar
                onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onSignInClick={onSignIn}
            />

            {/* Hero Section */}
            <section className="relative z-10 pt-16 md:pt-20 pb-24 md:pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs md:text-sm font-medium mb-8 md:mb-12"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 md:w-4 h-4 text-blue-500" />
                        <span>Private & Secure Workspace</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 md:mb-8 leading-tight"
                    >
                        Your Personal <br className="hidden sm:block" />
                        <span className="text-blue-500">
                            Resource Manager
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-14 font-medium"
                    >
                        A private sanctuary for your bookmarks, notes, and ideas.
                        Organized, searchable, and always accessible.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-col items-center justify-center gap-6 md:gap-8"
                    >
                        <Button
                            onClick={onGetStarted}
                            className="bg-[#f59e0b] hover:bg-[#d97706] text-black px-8 md:px-10 h-14 rounded-xl text-base font-bold shadow-lg shadow-amber-500/20 w-full sm:w-auto flex items-center justify-center gap-2 group border-none"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover grayscale opacity-80" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs md:text-sm text-slate-500 font-medium whitespace-nowrap">
                                Trusted by 2k+ developers worldwide
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-20 md:py-32 px-6 border-t border-slate-900 bg-[#020617]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        <FeatureCard
                            icon={Link2}
                            title="Save Links"
                            description="Bookmark any URL with tags and categories for instant retrieval."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={FileText}
                            title="Write Notes"
                            description="Capture ideas and thoughts instantly with full markdown support."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={FolderSearch}
                            title="Organize"
                            description="Custom categories and nested tags for easy and smart sorting."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Search}
                            title="Find Fast"
                            description="Deep full-text search across all your links, notes, and records."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Private"
                            description="Your data is encrypted and only accessible to you. Always."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Modern Badge Section */}
            <section className="relative z-10 py-20 md:py-32 px-6">
                <div className="max-w-6xl mx-auto p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-600/10 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                    <div className="relative z-10 grid md:grid-cols-2 items-center gap-10 md:gap-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Designed for the <br className="hidden md:block" />
                                <span className="text-blue-400">modern workflow.</span>
                            </h2>
                            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
                                Orbdyn isn't just a bookmark manager. It's an extension of your memory. Built for power users who need speed and privacy.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Globe, text: "Sync across all your devices" },
                                    { icon: Database, text: "Local-first storage for zero latency" },
                                    { icon: ShieldCheck, text: "Privacy-focused with E2E encryption" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-medium text-sm md:text-base">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-2xl md:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute top-0 left-0 right-0 h-8 md:h-10 bg-slate-900/50 border-b border-slate-800 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="pt-8 md:pt-10 flex items-center justify-center h-full">
                                <Layout className="w-16 h-16 md:w-24 md:h-24 text-blue-500/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-8 border-t border-slate-900 text-center">
                <p className="text-slate-500 text-xs md:text-sm font-medium">
                    © 2026 Orbdyn. Designed for professionals.
                </p>
            </footer>
        </div>
    );
}
