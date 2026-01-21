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
}

export default function ResourceDetailView({ resource, onBack, onEdit, onFavorite, onShare, categories }: ResourceDetailViewProps) {
    if (!resource) return null;

    const getCategoryColor = (tagName: string) => {
        const category = categories.find(c => c.name === tagName);
        return category ? category.color : null;
    };

    return (
        <div className="flex flex-col h-full bg-[#020617] rounded-3xl border border-slate-800/60 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden">
            {/* Header / Navigation */}
            <div className="px-6 py-3 border-b border-slate-800/40 bg-white/5 backdrop-blur-xl shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="pl-2 pr-3 py-1.5 h-8 hover:bg-white/5 text-slate-400 hover:text-white transition-all rounded-full group border border-transparent hover:border-slate-700/50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-semibold tracking-tight">Return</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onFavorite(resource.id)}
                            className={`h-8.5 w-8.5 rounded-xl transition-all shadow-lg ${resource.isFavorite
                                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 shadow-yellow-500/5"
                                : "text-slate-400 hover:text-white hover:bg-white/10 hover:shadow-white/5"}`}
                        >
                            <Star className={`w-4 h-4 ${resource.isFavorite ? "fill-yellow-400" : ""}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onShare(resource)}
                            className="h-8.5 w-8.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-lg hover:shadow-white/5"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(resource)}
                            className="h-8.5 w-8.5 rounded-xl text-slate-400 hover:text-white hover:bg-blue-500/20 transition-all shadow-lg hover:shadow-blue-500/5"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xl ring-2 ring-slate-900/50 ${resource.type === 'Link' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20' :
                            resource.type === 'Note' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20' :
                                'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/20'
                            }`}>
                            {resource.type === 'Link' && <LinkIcon className="w-6 h-6" />}
                            {resource.type === 'Note' && <FileText className="w-6 h-6" />}
                            {resource.type === 'To Do' && <CheckSquare className="w-6 h-6" />}
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={`bg-white/10 text-white border-none rounded-full px-2 py-0 text-[9px] font-bold uppercase tracking-wider ${resource.type === 'Link' ? 'text-blue-400' : resource.type === 'Note' ? 'text-emerald-400' : 'text-purple-400'}`}>
                                    {resource.type}
                                </Badge>
                                <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">•</span>
                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h1 className="text-lg font-extrabold text-white leading-tight tracking-tight max-w-2xl drop-shadow-sm">
                                {resource.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10 max-w-5xl mx-auto">

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resource.type === 'To Do' && resource.priority && (
                            <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                                <div className={`p-2.5 rounded-xl ${resource.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : resource.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Priority</div>
                                    <div className={`text-sm font-bold ${resource.priority === 'High' ? 'text-rose-400' : resource.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{resource.priority}</div>
                                </div>
                            </div>
                        )}
                        {resource.dueDate && (
                            <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Target Date</div>
                                    <div className="text-sm font-bold text-slate-200">{resource.dueDate} {resource.dueTime && `@ ${resource.dueTime}`}</div>
                                </div>
                            </div>
                        )}
                        <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                            <div className="p-2.5 rounded-xl bg-slate-700/50 text-slate-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">ID Reference</div>
                                <div className="text-sm font-mono text-slate-400 uppercase truncate">#{resource.id.slice(0, 8)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                        {(resource.description || resource.content) && (
                            <div className="relative">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    <div className="h-px bg-slate-800 flex-1"></div>
                                    {resource.description ? "Overview" : "Content"}
                                    <div className="h-px bg-slate-800 flex-1"></div>
                                </h4>
                                <div className="text-slate-300 text-xl leading-relaxed font-light py-2">
                                    {resource.description || resource.content}
                                </div>
                            </div>
                        )}

                        {resource.description && resource.content && resource.content !== resource.description && (
                            <div className="mt-8">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    <div className="h-px bg-slate-800 w-8"></div>
                                    Detailed Content
                                </h4>
                                <div className="bg-[#0f172a]/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800/60 text-slate-300 font-mono text-base whitespace-pre-wrap leading-relaxed shadow-inner">
                                    {resource.content}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resources & Assets */}
                    <div className="grid grid-cols-1 gap-12 pt-4">
                        {/* URL Section */}
                        {resource.url && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                    Primary Link
                                </h4>
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800 group-hover:border-slate-700/50 transition-all">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <ExternalLink className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Destination URL</div>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-400 hover:text-white transition-colors font-bold truncate block decoration-2 underline-offset-4 hover:underline">
                                                {resource.url}
                                            </a>
                                        </div>
                                        <Button
                                            onClick={() => window.open(resource.url, '_blank')}
                                            className="w-full sm:w-auto px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95"
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
                                        <div key={i} className="group relative aspect-square bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all">
                                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors z-10" />
                                            <div className="flex flex-col items-center justify-center gap-3 p-4 h-full text-slate-500 group-hover:text-blue-400 transition-all transform group-hover:scale-105">
                                                <div className="p-3 bg-slate-900/50 rounded-2xl">
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
                                        <div key={i} className="flex items-center gap-5 p-5 bg-slate-800/20 rounded-[1.5rem] border border-slate-800 group hover:bg-slate-800/40 hover:border-slate-700 transition-all cursor-pointer">
                                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:text-blue-400 transition-colors">
                                                <Paperclip className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{doc}</div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document File</div>
                                            </div>
                                            <Download className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Section */}
                        {resource.tags && resource.tags.length > 0 && (
                            <div className="pt-6 border-t border-slate-800/60">
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
                                                    backgroundColor: 'rgba(30, 41, 59, 0.3)',
                                                    color: '#94a3b8'
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
