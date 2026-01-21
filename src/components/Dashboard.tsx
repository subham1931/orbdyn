import { useState } from "react";
import {
    LayoutGrid,
    Link as LinkIcon,
    FileText,
    CheckSquare,
    Star,
    Archive,
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Download,
    Upload,
    Settings,
    LogOut,
    ChevronDown,
    FolderPlus,
    Layout,
    Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SettingsPage from "./SettingsPage";

interface DashboardProps {
    onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("All Resources");

    const menuItems = [
        { name: "All Resources", icon: LayoutGrid },
        { name: "Links", icon: LinkIcon },
        { name: "Notes", icon: FileText },
        { name: "To Do", icon: CheckSquare },
        { name: "Favorites", icon: Star },
        { name: "Archive", icon: Archive },
    ];

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-900 flex flex-col z-20">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black tracking-wider text-white uppercase font-sans">Orbdyn</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-4 overflow-y-auto mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${activeTab === item.name
                                ? "bg-[#1e293b] text-blue-400 shadow-sm"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${activeTab === item.name ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
                            {item.name}
                        </button>
                    ))}

                    <div className="pt-8 pb-4">
                        <div className="flex items-center justify-between px-3 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Categories <ChevronDown className="w-3 h-3" />
                            </span>
                        </div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <FolderPlus className="w-4 h-4" />
                            Add Category
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-900 space-y-3">
                    <div className="px-3 py-3 mb-2">
                        <p className="text-xs font-medium text-slate-400 truncate">subham019650@gmail.com</p>
                    </div>
                    <button
                        onClick={() => setActiveTab("Settings")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "Settings"
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl">
                    <div className="relative w-96 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Search resources..."
                            className="bg-[#0f172a] border-[#1e293b] h-10 pl-10 rounded-lg focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 bg-transparent border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                            <Filter className="w-3.5 h-3.5" /> Filters
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 bg-transparent border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                            <ArrowUpDown className="w-3.5 h-3.5" /> Custom
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 bg-transparent border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                            <Download className="w-3.5 h-3.5" /> Export
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 bg-transparent border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                            <Upload className="w-3.5 h-3.5" /> Import
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 bg-transparent border-[#1e293b] text-slate-300 hover:text-white hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                            <CheckSquare className="w-3.5 h-3.5" /> Select
                        </Button>
                        <Button className="h-9 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg gap-2 font-bold px-5 ml-2 border-none">
                            <Plus className="w-4 h-4" /> Add
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {activeTab === "Settings" ? (
                        <SettingsPage onSignOut={onSignOut} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8">
                            <div className="max-w-md w-full text-center space-y-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 border border-slate-800 text-slate-500 shadow-inner">
                                    <Folder className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">No resources yet</h2>
                                    <p className="text-slate-500 font-medium">
                                        Start building your journal by adding links, notes, and professional resources.
                                    </p>
                                </div>
                                <Button className="h-14 bg-[#f59e0b] hover:bg-[#d97706] text-black px-8 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/20 group border-none">
                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform mr-2" />
                                    Add Your First Resource
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ambient background decoration */}
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
            </main>
        </div>
    );
}
