import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout,
    Mail,
    Lock,
    User,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Navbar from "./Navbar";

interface AuthPageProps {
    onBack: () => void;
    onSuccess: () => void;
    initialMode?: "signin" | "signup";
}

export default function AuthPage({ onBack, onSuccess, initialMode = "signin" }: AuthPageProps) {
    const [mode, setMode] = useState<"signin" | "signup">(initialMode);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate auth
        setTimeout(() => {
            setIsLoading(false);

            // Store user details in localStorage
            const userData = {
                name: mode === "signup" ? name : (name || "Subham"), // Default if signing in
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            localStorage.setItem("orbdyn_user", JSON.stringify(userData));

            onSuccess();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <Navbar onLogoClick={onBack} showSignIn={false} />

            <main className="flex-1 flex flex-col lg:flex-row relative">
                {/* Mesh Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[100px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[100px]" />
                </div>

                {/* Left Side - Hero Content */}
                <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative z-10 border-r border-slate-900/50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md text-center"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                <Layout className="text-white w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Personal Resource <br />
                            <span className="text-blue-500">Manager</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            Your private sanctuary for bookmarks, notes, and ideas. Organized, secure, and always accessible.
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Organized', color: 'bg-blue-500/10 text-blue-400' },
                                { label: 'Secure', color: 'bg-indigo-500/10 text-indigo-400' },
                                { label: 'Accessible', color: 'bg-emerald-500/10 text-emerald-400' }
                            ].map((badge, i) => (
                                <div key={i} className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider ${badge.color}`}>
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[440px] p-8 md:p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                        <div className="relative">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-white mb-3">
                                    {mode === "signin" ? "Welcome Back" : "Create Account"}
                                </h2>
                                <p className="text-slate-400 font-medium">
                                    {mode === "signin"
                                        ? "Sign in to access your resources"
                                        : "Start organizing your resources today"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AnimatePresence mode="wait">
                                    {mode === "signup" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                                <Input
                                                    placeholder="Your name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="bg-slate-950/50 border-slate-800 h-14 pl-12 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-slate-950/50 border-slate-800 h-14 pl-12 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                        {mode === "signin" && (
                                            <button type="button" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                                Forgot Password?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-slate-950/50 border-slate-800 h-14 pl-12 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-2 group border-none"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {mode === "signin" ? "Sign In" : "Create Account"}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>



                            <div className="mt-8 text-center">
                                <p className="text-slate-400 font-medium">
                                    {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                        className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                                    >
                                        {mode === "signin" ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <footer className="relative z-10 py-8 px-8 text-center">
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                    © 2026 Orbdyn • Private & Secure
                </p>
            </footer>
        </div>
    );
}
