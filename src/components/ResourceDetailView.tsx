import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, FileText, CheckSquare, Calendar, Tag, ExternalLink, ChevronLeft, Image as ImageIcon, Paperclip, Pencil, Star, Share2, Download } from "lucide-react";
import type { Resource, Category } from "@/types";

interface ResourceDetailViewProps {
    resource: Resource;
    onBack: () => void;
    onEdit: (resource: Resource) => void;
    onFavorite: (id: string) => void;
    onShare: (resource: Resource) => void;
    categories: Category[]; // To look up category colors
    theme: "light" | "dark";
}

export default function ResourceDetailView({ resource, onBack, onEdit, onFavorite, onShare, categories, theme }: ResourceDetailViewProps) {
    if (!resource) return null;

    const getCategoryColor = (tagName: string) => {
        const category = categories.find(c => c.name === tagName);
        return category ? category.color : null;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#020617] rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden transition-colors duration-300">
            {/* Top Navigation Bar */}
            <div className="px-6 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/40 bg-white/40 dark:bg-[#020617]/40 backdrop-blur-2xl z-20 shrink-0">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="pl-2 pr-4 h-9 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl group border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                >
                    <ChevronLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold tracking-wider uppercase">Return</span>
                </Button>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onFavorite(resource.id)}
                            className={`h-8 w-8 rounded-lg transition-all ${resource.isFavorite
                                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"}`}
                        >
                            <Star className={`w-3.5 h-3.5 ${resource.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onShare(resource)}
                            className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(resource)}
                            className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative pt-12 pb-8 px-8 shrink-0 overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-20 rounded-full ${resource.type === 'Link' ? 'bg-blue-500' : resource.type === 'Note' ? 'bg-emerald-500' : 'bg-purple-500'}`} />

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row md:items-end gap-6">
                    {/* Icon Container */}
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl relative group overflow-hidden ${resource.type === 'Link' ? 'bg-blue-600 shadow-blue-500/20' :
                        resource.type === 'Note' ? 'bg-emerald-600 shadow-emerald-500/20' :
                            'bg-purple-600 shadow-purple-500/20'
                        }`}>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {resource.type === 'Link' && <LinkIcon className="w-9 h-9 text-white" />}
                        {resource.type === 'Note' && <FileText className="w-9 h-9 text-white" />}
                        {resource.type === 'To Do' && <CheckSquare className="w-9 h-9 text-white" />}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border transition-colors ${resource.type === 'Link' ? 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5' : resource.type === 'Note' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/5'}`}>
                                {resource.type}
                            </Badge>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full transition-colors">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    {new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl">
                            {resource.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10 max-w-5xl mx-auto">

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resource.type === 'To Do' && resource.priority && (
                            <div className="bg-slate-50 dark:bg-[#0f172a]/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/60 flex items-center gap-4 group hover:border-blue-500/20 dark:hover:border-slate-700 transition-all shadow-xl shadow-slate-200/50 dark:shadow-black/10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${resource.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : resource.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Priority</div>
                                    <div className={`text-lg font-semibold ${resource.priority === 'High' ? 'text-rose-400' : resource.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{resource.priority}</div>
                                </div>
                            </div>
                        )}
                        {resource.dueDate && (
                            <div className="bg-slate-50 dark:bg-[#0f172a]/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/60 flex items-center gap-4 group hover:border-blue-500/20 dark:hover:border-slate-700 transition-all shadow-xl shadow-slate-200/50 dark:shadow-black/10">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Target Date</div>
                                    <div className="text-lg font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{resource.dueDate}</div>
                                </div>
                            </div>
                        )}
                        <div className="bg-slate-50 dark:bg-[#0f172a]/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/60 flex items-center gap-4 group hover:border-blue-500/20 dark:hover:border-slate-700 transition-all shadow-xl shadow-slate-200/50 dark:shadow-black/10">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-200 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">ID Reference</div>
                                <div className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase truncate">#{resource.id.slice(0, 10)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        {(resource.description || resource.content) && (
                            <div className="relative">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-6 justify-center">
                                    <div className="h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800/80 flex-1"></div>
                                    {resource.description ? "Overview" : "Content"}
                                    <div className="h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800/80 flex-1"></div>
                                </h4>
                                <div className="text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed font-normal py-4 px-2 text-center max-w-4xl mx-auto drop-shadow-md">
                                    {resource.description || resource.content}
                                </div>
                            </div>
                        )}

                        {resource.description && resource.content && resource.content !== resource.description && (
                            <div className="mt-8">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-8"></div>
                                    Detailed Content
                                </h4>
                                <div className="bg-slate-50 dark:bg-[#0f172a]/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-mono text-base whitespace-pre-wrap leading-relaxed shadow-inner transition-colors">
                                    {resource.content}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resources & Assets */}
                    <div className="grid grid-cols-1 gap-12 pt-4">
                        {/* URL Section */}
                        {resource.url && (
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Primary Resource
                                    <div className="h-px bg-slate-200 dark:bg-slate-800/60 flex-1"></div>
                                </h4>
                                <div className="group relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                    <div className="relative flex flex-col md:flex-row items-center gap-6 p-8 bg-slate-50 dark:bg-[#0f172a]/60 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 transition-all duration-500 overflow-hidden group-hover:border-blue-500/30">
                                        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center shrink-0 border border-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                                            <ExternalLink className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Destination</div>
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xl text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold truncate block decoration-2 underline-offset-8 hover:underline"
                                            >
                                                {resource.url}
                                            </a>
                                        </div>
                                        <Button
                                            onClick={() => window.open(resource.url, '_blank')}
                                            className="w-full md:w-auto px-10 py-7 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-2xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 text-lg tracking-tight"
                                        >
                                            Inbound Link
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Images Section */}
                        {resource.images && resource.images.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Visual Assets</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {resource.images.map((img, i) => (
                                        <div key={i} className="group relative aspect-square bg-slate-100 dark:bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 transition-all">
                                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors z-10" />
                                            <div className="flex flex-col items-center justify-center gap-3 p-4 h-full text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all transform group-hover:scale-105">
                                                <div className="p-3 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm dark:shadow-none transition-colors">
                                                    <ImageIcon className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <span className="text-[10px] uppercase font-black tracking-widest truncate max-w-full px-2">{img}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents Section */}
                        {resource.documents && resource.documents.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Attachments</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resource.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/20 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-blue-500/30 dark:hover:border-slate-700 transition-all cursor-pointer">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 shadow-sm transition-colors">
                                                <Paperclip className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{doc}</div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document File</div>
                                            </div>
                                            <Download className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Section */}
                        {resource.tags && resource.tags.length > 0 && (
                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60">
                                <div className="flex flex-wrap gap-3">
                                    {resource.tags.map(tag => {
                                        const color = getCategoryColor(tag);
                                        return (
                                            <div
                                                key={tag}
                                                className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all hover:-translate-y-1 cursor-default ring-1 ring-inset"
                                                style={color ? {
                                                    backgroundColor: `${color}15`,
                                                    color: color,
                                                    boxShadow: `0 4px 12px ${color}10`
                                                } : {
                                                    backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 1)',
                                                    color: theme === 'dark' ? '#94a3b8' : '#64748b',
                                                    border: theme === 'light' ? '1px solid #e2e8f0' : 'none'
                                                }}
                                            >
                                                {tag}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
