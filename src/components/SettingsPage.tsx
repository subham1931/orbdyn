import { useState } from "react";
import {
    Palette,
    Moon,
    Sun,
    Bell,
    Globe,
    Zap,
    type LucideIcon,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";


export default function SettingsPage({ theme, onThemeChange }: { theme: "light" | "dark", onThemeChange: (t: "light" | "dark") => void }) {
    const [colorTheme, setColorTheme] = useState("Ocean Blue");

    const colorThemes = [
        { name: "Ocean Blue", color: "#3b82f6", bg: "bg-blue-500" },
        { name: "Royal Purple", color: "#a855f7", bg: "bg-purple-500" },
        { name: "Emerald", color: "#10b981", bg: "bg-emerald-500" },
        { name: "Rose", color: "#f43f5e", bg: "bg-rose-500" },
        { name: "Amber", color: "#f59e0b", bg: "bg-amber-500" },
        { name: "Slate", color: "#64748b", bg: "bg-slate-500" },
    ];

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium">Manage your application preferences and appearance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation/Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-colors duration-500" />

                        <div className="flex flex-col items-center text-center space-y-4 py-4 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                                <Palette className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Workspace</h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Customize your environment</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20">Pro Member</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <SettingNavItem icon={Palette} label="Appearance" active />
                        <SettingNavItem icon={Bell} label="Notifications" />
                        <SettingNavItem icon={Globe} label="Language" />
                        <SettingNavItem icon={Zap} label="Integrations" />
                    </div>
                </div>

                {/* Right Column - Detailed Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Appearance Section */}
                    <section className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 space-y-8 shadow-lg shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Visual Identity</h2>
                                <p className="text-sm text-slate-500 font-medium">Personalize your workspace aesthetics</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Interface Mode</label>
                                <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 dark:bg-[#0b1120]/50 rounded-3xl border border-slate-200 dark:border-slate-800/60 max-w-sm">
                                    <button
                                        onClick={() => onThemeChange("light")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${theme === "light" ? "bg-white text-slate-950 shadow-xl scale-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 scale-[0.98]"} `}
                                    >
                                        <Sun className={`w-4 h-4 ${theme === "light" ? "fill-orange-400 text-orange-400" : ""}`} /> Light
                                    </button>
                                    <button
                                        onClick={() => onThemeChange("dark")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${theme === "dark" ? "bg-blue-600 text-white shadow-xl scale-100 shadow-blue-500/20" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 scale-[0.98]"} `}
                                    >
                                        <Moon className={`w-4 h-4 ${theme === "dark" ? "fill-white/20" : ""}`} /> Dark
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Accent Palettes</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {colorThemes.map((t) => (
                                        <button
                                            key={t.name}
                                            onClick={() => setColorTheme(t.name)}
                                            className={`flex items-center gap-3 p-4 rounded-3xl border transition-all duration-300 hover:scale-105 active:scale-95 ${colorTheme === t.name
                                                ? "bg-white dark:bg-[#0b1120] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 dark:ring-blue-500/20"
                                                : "bg-slate-50 dark:bg-[#0b1120]/50 border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
                                                } `}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full ${t.bg} shadow-lg shadow-black/20`} />
                                            <span className={`text-xs font-bold ${colorTheme === t.name ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{t.name}</span>
                                            {colorTheme === t.name && (
                                                <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center animate-in zoom-in duration-300">
                                                    <Check className="w-3 h-3 text-white stroke-[4]" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-2xl px-10 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                                Save Settings
                            </Button>
                        </div>
                    </section>

                    {/* Support & API */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col justify-between space-y-4 shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Need Help?</h3>
                                <p className="text-sm text-slate-500 font-medium">Contact our support sanctuary</p>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 dark:border-slate-700 font-bold">
                                Support Center
                            </Button>
                        </div>
                        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col justify-between space-y-4 shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">API Access</h3>
                                <p className="text-sm text-slate-500 font-medium">Developer tools and integration keys</p>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 dark:border-slate-700 font-bold">
                                Manage Keys
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingNavItem({ icon: Icon, label, active = false }: { icon: LucideIcon, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${active
            ? "bg-blue-600 text-white shadow-xl shadow-blue-500/15"
            : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
            <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300 transition-colors"}`} />
            {label}
            {!active && <div className="ml-auto w-1 h-1 rounded-full bg-slate-800 group-hover:bg-slate-600 transition-colors" />}
        </button>
    );
}
