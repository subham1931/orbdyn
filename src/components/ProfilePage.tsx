import { Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfilePageProps {
    user: { name: string; email: string; avatar: string };
    onSignOut: () => void;
}

export default function ProfilePage({ user, onSignOut }: ProfilePageProps) {
    return (
        <div className="flex-1 flex flex-col p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 w-full">
            <div className="text-center space-y-4">
                <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden mx-auto">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                        <Pencil className="w-5 h-5" />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{user.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Account Details</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <Input value={user.name} readOnly className="bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <Input value={user.email} readOnly className="bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-12 rounded-xl focus:ring-0" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security</h2>
                    <div className="space-y-4">
                        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Password Management</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">For security, your password can only be updated through the main secure gateway.</p>
                            <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-800 font-bold">Request Password Reset</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <Button
                    variant="destructive"
                    onClick={onSignOut}
                    className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-red-500/10 gap-3"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out from Orbdyn
                </Button>
            </div>
        </div>
    );
}
