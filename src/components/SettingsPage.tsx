import { useState } from "react";
import {
    User,
    Palette,
    Moon,
    Sun,
    LogOut,
    Trash2,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsPageProps {
    onSignOut: () => void;
}

export default function SettingsPage({ onSignOut }: SettingsPageProps) {
    const [displayName, setDisplayName] = useState("subham");
    const [theme, setTheme] = useState("dark");
    const [colorTheme, setColorTheme] = useState("Ocean Blue");

    const colorThemes = [
        { name: "Ocean Blue", color: "bg-blue-500" },
        { name: "Royal Purple", color: "bg-purple-500" },
        { name: "Emerald Green", color: "bg-emerald-500" },
        { name: "Rose Pink", color: "bg-rose-500" },
        { name: "Golden Amber", color: "bg-amber-500" },
    ];

    return (
        <div className="w-full space-y-6 p-6 md:p-8 text-slate-200 font-sans">
            {/* Profile Section */}
            <section className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Profile</h2>
                        <p className="text-sm text-slate-500 font-medium">Manage your profile information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email</label>
                        <Input
                            value="subham019650@gmail.com"
                            readOnly
                            className="bg-[#0b1120] border-slate-800 text-slate-400 h-11 rounded-xl focus:ring-0 focus:border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Display Name</label>
                        <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="bg-[#0b1120] border-slate-800 text-white h-11 rounded-xl focus:ring-blue-500/20 focus:border-blue-500/50"
                        />
                    </div>
                    <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-sky-500/20">
                        Save Changes
                    </Button>
                </div>
            </section>

            {/* Appearance Section */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Palette className="w-5 h-5 text-slate-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Appearance</h2>
                        <p className="text-sm text-slate-500 font-medium">Customize the look and feel of the app</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mode</label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-[#0b1120] rounded-xl border border-slate-800">
                            <button
                                onClick={() => setTheme("light")}
                                className={`flex items - center justify - center gap - 2 py - 2.5 rounded - lg text - sm font - bold transition - all ${theme === "light" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"} `}
                            >
                                <Sun className="w-4 h-4" /> Light
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={`flex items - center justify - center gap - 2 py - 2.5 rounded - lg text - sm font - bold transition - all ${theme === "dark" ? "bg-[#0ea5e9]/10 text-[#0ea5e9] shadow-lg border border-[#0ea5e9]/20" : "text-slate-500 hover:text-slate-300"} `}
                            >
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Color Theme</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {colorThemes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => setColorTheme(t.name)}
                                    className={`flex items - center gap - 3 px - 3 py - 3 rounded - xl border transition - all ${colorTheme === t.name
                                            ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-white"
                                            : "bg-[#0b1120] border-slate-800 text-slate-400 hover:border-slate-700"
                                        } `}
                                >
                                    <div className={`w - 4 h - 4 rounded - full ${t.color} `} />
                                    <span className="text-sm font-medium">{t.name}</span>
                                    {colorTheme === t.name && <Check className="w-3.5 h-3.5 ml-auto text-[#0ea5e9]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Account</h2>
                        <p className="text-sm text-slate-500 font-medium">Manage your account settings</p>
                    </div>
                </div>

                <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#0b1120] border border-slate-800 rounded-xl text-slate-200 hover:bg-slate-800 transition-all font-medium group"
                >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    Sign Out
                </button>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div>
                        <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
                        <p className="text-sm text-red-900/70 font-medium">Irreversible and destructive actions</p>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-red-500/20"
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
            </section>
        </div>
    );
}
