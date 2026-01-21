import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, FileText, CheckSquare, Calendar, Tag, ExternalLink, ChevronLeft, Image as ImageIcon, Paperclip } from "lucide-react";
import type { Resource, Category } from "@/types";

interface ResourceDetailViewProps {
    resource: Resource;
    onBack: () => void;
    categories: Category[]; // To look up category colors
}

export default function ResourceDetailView({ resource, onBack, categories }: ResourceDetailViewProps) {
    if (!resource) return null;

    const getCategoryColor = (tagName: string) => {
        const category = categories.find(c => c.name === tagName);
        return category ? category.color : null;
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-800/50">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-6 pl-0 hover:bg-transparent text-slate-400 hover:text-white transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to resources
                </Button>

                <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${resource.type === 'Link' ? 'bg-blue-500/10 text-blue-400 shadow-blue-500/10' :
                        resource.type === 'Note' ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10' :
                            'bg-purple-500/10 text-purple-400 shadow-purple-500/10'
                        }`}>
                        {resource.type === 'Link' && <LinkIcon className="w-8 h-8" />}
                        {resource.type === 'Note' && <FileText className="w-8 h-8" />}
                        {resource.type === 'To Do' && <CheckSquare className="w-8 h-8" />}
                    </div>
                    <div className="space-y-2 mt-1">
                        <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
                            {resource.title}
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <Badge variant="outline" className="text-slate-400 border-slate-700">
                                {resource.type}
                            </Badge>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(resource.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* To-Do Quick Info Bar */}
            {resource.type === 'To Do' && (resource.priority || resource.dueDate) && (
                <div className="px-8 py-3 bg-slate-900/50 border-b border-slate-800/50 flex items-center gap-6">
                    {resource.priority && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</span>
                            <Badge
                                variant="secondary"
                                className={`rounded-md px-2 py-0 border-none text-[10px] font-bold uppercase ${resource.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                                    resource.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-emerald-500/10 text-emerald-500'
                                    }`}
                            >
                                {resource.priority}
                            </Badge>
                        </div>
                    )}
                    {resource.dueDate && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Due Date</span>
                            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                {resource.dueDate} {resource.dueTime && `@ ${resource.dueTime}`}
                            </span>
                        </div>
                    )}
                </div>
            )
            }

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl space-y-8">
                    {/* Description / Summary */}
                    {(resource.description || resource.content) && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                {resource.description ? "Description" : "Content"}
                            </h4>
                            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-light border-l-2 border-slate-800 pl-4">
                                {resource.description || resource.content}
                            </div>
                        </div>
                    )}

                    {/* Main Content (if separate from description, typically for Notes) */}
                    {resource.description && resource.content && resource.content !== resource.description && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Content
                            </h4>
                            <div className="bg-[#1e293b]/30 p-6 rounded-xl border border-slate-800 text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                                {resource.content}
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {resource.images && resource.images.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Images
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {resource.images?.map((img, i) => (
                                    <div key={i} className="group relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 p-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider truncate max-w-full px-2">{img}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {resource.documents && resource.documents.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> Documents
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {resource.documents?.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[#1e293b]/50 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors group cursor-not-allowed text-slate-400">
                                        <div className="p-2 bg-slate-800 rounded-md group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium truncate flex-1">{doc}</span>
                                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">FILE</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {resource.url && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Resource Link
                            </h4>
                            <div className="flex items-center gap-4 p-4 bg-[#1e293b]/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <ExternalLink className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-slate-400 mb-0.5">External URL</div>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium truncate block hover:underline"
                                    >
                                        {resource.url}
                                    </a>
                                </div>
                                <Button
                                    onClick={() => window.open(resource.url, '_blank')}
                                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20"
                                >
                                    Open Link
                                </Button>
                            </div>
                        </div>
                    )}

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="space-y-3 pt-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags?.map(tag => {
                                    const color = getCategoryColor(tag);
                                    return (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="border-none rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105"
                                            style={color ? {
                                                backgroundColor: `${color}26`,
                                                color: color,
                                                boxShadow: `0 0 10px ${color}10`
                                            } : {
                                                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                                color: '#94a3b8'
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
