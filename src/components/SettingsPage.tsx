import { useState } from "react";
import {
    User,
    Palette,
    Moon,
    Sun,
    LogOut,
    Trash2,
    Check,
    Mail,
    Shield,
    Bell,
    Globe,
    CreditCard,
    Zap,
    type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsPageProps {
    theme: "light" | "dark";
    onThemeChange: (theme: "light" | "dark") => void;
    onSignOut: () => void;
}

export default function SettingsPage({ theme, onThemeChange, onSignOut }: SettingsPageProps) {
    const [displayName, setDisplayName] = useState("subham");
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
                <p className="text-slate-500 font-medium">Manage your account preferences and application appearance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation/Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-colors duration-500" />

                        <div className="flex flex-col items-center text-center space-y-4 py-4 relative z-10">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-1">
                                    <div className="w-full h-full rounded-full bg-slate-50 dark:bg-[#020617] flex items-center justify-center overflow-hidden">
                                        <User className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 border-4 border-white dark:border-[#020617] rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{displayName}</h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">subham019650@gmail.com</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20">Pro Member</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200 dark:border-slate-700">Admin</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <SettingNavItem icon={User} label="Profile Info" active />
                        <SettingNavItem icon={Shield} label="Security" />
                        <SettingNavItem icon={Bell} label="Notifications" />
                        <SettingNavItem icon={Globe} label="Language" />
                        <SettingNavItem icon={CreditCard} label="Billing" />
                        <SettingNavItem icon={Zap} label="Integrations" />
                    </div>
                </div>

                {/* Right Column - Detailed Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Personal Details</h2>
                                <p className="text-sm text-slate-500 font-medium">How you appear to others on Orbdyn</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                                    <Input
                                        value="subham019650@gmail.com"
                                        readOnly
                                        className="bg-slate-50 dark:bg-[#0b1120]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 h-12 pl-11 rounded-2xl focus:ring-0 cursor-default"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Display Name</label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="bg-slate-50 dark:bg-[#0b1120]/80 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 text-slate-900 dark:text-white h-12 px-5 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-2xl px-10 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                                Save Changes
                            </Button>
                        </div>
                    </section>

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
                    </section>

                    {/* Security & SessionCombined */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 flex flex-col justify-between space-y-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session Control</h3>
                                <p className="text-sm text-slate-500 font-medium">Log out of your current session safely</p>
                            </div>
                            <button
                                onClick={onSignOut}
                                className="w-full flex items-center justify-center gap-3 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white transition-all font-bold group"
                            >
                                <LogOut className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </div>
                        <div className="bg-red-50 dark:bg-red-500/5 backdrop-blur-xl border border-red-100 dark:border-red-900/30 rounded-[2.5rem] p-8 flex flex-col justify-between space-y-6 shadow-lg shadow-red-100/20 dark:shadow-none">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-red-600 dark:text-red-500">Danger Zone</h3>
                                <p className="text-sm text-red-700/60 dark:text-red-400/60 font-medium">Permanently delete your entire data vault</p>
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full bg-red-600/10 hover:bg-red-600 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-500 hover:text-white font-bold h-12 rounded-2xl shadow-lg shadow-red-500/5 transition-all"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
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
