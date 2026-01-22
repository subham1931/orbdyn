import { useEffect, useState } from "react";
import { Pencil, LogOut, Check, X, Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfilePageProps {
    user: { name: string; email: string; avatar: string };
    onSignOut: () => void;
    onUpdateUser: (updatedUser: { name: string; email: string; avatar: string }) => void;
}

export default function ProfilePage({ user, onSignOut, onUpdateUser }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatar);

    useEffect(() => {
        if (isEditing) return;
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);
    }, [user, isEditing]);

    const handleSave = () => {
        onUpdateUser({ name, email, avatar });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);
        setIsEditing(false);
    };

    const generateNewAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
    };

    return (
        <div className="flex-1 flex flex-col p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 w-full no-scrollbar">
            <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage your personal details and sign-in identity.</p>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold"
                        >
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4"
                        >
                            <Check className="w-4 h-4 mr-2" /> Save changes
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold"
                        >
                            <Pencil className="w-4 h-4 mr-2" /> Edit profile
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={onSignOut}
                            className="h-10 rounded-xl font-bold"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign out
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800">
                                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={generateNewAvatar}
                                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm grid place-items-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                        title="Generate random avatar"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="text-base font-bold text-slate-900 dark:text-white truncate">{name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{email}</div>
                            </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/70 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                <Camera className="w-4 h-4" />
                                Avatar
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Your avatar is used across Orbdyn. You can paste a URL or generate a new one.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account details */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-8 space-y-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Account details</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update your name and profile image.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Full name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    readOnly={!isEditing}
                                    className={`${!isEditing ? "bg-slate-50 dark:bg-[#0b1120]/40" : "bg-white dark:bg-[#0b1120]"} border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-1 focus:ring-blue-500/30 transition-all font-medium`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email</label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly={!isEditing}
                                    className={`${!isEditing ? "bg-slate-50 dark:bg-[#0b1120]/40" : "bg-white dark:bg-[#0b1120]"} border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-1 focus:ring-blue-500/30 transition-all font-medium`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Avatar URL</label>
                                {!isEditing && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Edit profile to change</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    readOnly={!isEditing}
                                    placeholder="https://..."
                                    className={`${!isEditing ? "bg-slate-50 dark:bg-[#0b1120]/40" : "bg-white dark:bg-[#0b1120]"} border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-1 focus:ring-blue-500/30 transition-all font-medium flex-1 text-xs`}
                                />
                                <Button
                                    onClick={generateNewAvatar}
                                    disabled={!isEditing}
                                    variant="outline"
                                    className="h-12 w-12 rounded-xl border-slate-200 dark:border-slate-800 p-0 shrink-0"
                                    title="Generate random avatar"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Security</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
                            Password changes aren’t available in this demo build.
                        </p>
                        <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 font-bold">
                            Request password reset
                        </Button>
                    </section>
                </div>
            </div>
        </div>
    );
}
