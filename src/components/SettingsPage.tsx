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
        <div className="flex-1 w-full p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Appearance and workspace preferences.</p>
                </div>
                <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold"
                    title="Settings are saved automatically on change in this demo"
                >
                    Saved automatically
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/10">
                                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Customize how Orbdyn looks.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
                        <SettingNavItem icon={Palette} label="Appearance" active />
                        <SettingNavItem icon={Bell} label="Notifications" />
                        <SettingNavItem icon={Globe} label="Language" />
                        <SettingNavItem icon={Zap} label="Integrations" />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-8 space-y-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Appearance</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Theme mode and accent palette.</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Theme</label>
                                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 dark:bg-[#0b1120]/50 rounded-2xl border border-slate-200 dark:border-slate-800/60 max-w-sm">
                                    <button
                                        onClick={() => onThemeChange("light")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${theme === "light"
                                            ? "bg-white dark:bg-[#0f172a] text-slate-950 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            }`}
                                    >
                                        <Sun className="w-4 h-4" /> Light
                                    </button>
                                    <button
                                        onClick={() => onThemeChange("dark")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${theme === "dark"
                                            ? "bg-white dark:bg-[#0f172a] text-slate-950 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            }`}
                                    >
                                        <Moon className="w-4 h-4" /> Dark
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Accent</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {colorThemes.map((t) => (
                                        <button
                                            key={t.name}
                                            onClick={() => setColorTheme(t.name)}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${colorTheme === t.name
                                                ? "bg-white dark:bg-[#0b1120] border-blue-500 ring-1 ring-blue-500/20"
                                                : "bg-slate-50 dark:bg-[#0b1120]/50 border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                                }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full ${t.bg} shadow-sm`} />
                                            <span className={`text-xs font-bold ${colorTheme === t.name ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{t.name}</span>
                                            {colorTheme === t.name && (
                                                <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white stroke-[4]" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    Accent is visual only in this demo build.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Support</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Get help and documentation.</p>
                            </div>
                            <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 font-bold">
                                Support center
                            </Button>
                        </div>
                        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">API keys</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Developer tools and integration keys.</p>
                            </div>
                            <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 font-bold">
                                Manage keys
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
        <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${active
                ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
        >
            <Icon className={`w-4 h-4 ${active ? "text-slate-900 dark:text-white" : "text-slate-500"}`} />
            {label}
        </button>
    );
}
