import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="flex flex-col h-full bg-white dark:bg-[#020617] animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden transition-colors duration-300">
            {/* Header (shadcn-style card) */}
            <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#020617]/40 backdrop-blur-xl">
                <div className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 rounded-lg">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border-0 ${resource.type === 'Link' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : resource.type === 'Note' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>
                                        {resource.type}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="mt-1 text-xl md:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                                    {resource.title}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" onClick={() => onEdit(resource)} className="h-9 rounded-lg">
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onShare(resource)} className="h-9 rounded-lg">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                variant={resource.isFavorite ? "default" : "outline"}
                                size="sm"
                                onClick={() => onFavorite(resource.id)}
                                className={`h-9 rounded-lg ${resource.isFavorite ? "bg-yellow-500 hover:bg-yellow-400 text-black border-none" : ""}`}
                            >
                                <Star className={`w-4 h-4 mr-2 ${resource.isFavorite ? "fill-current" : ""}`} />
                                Favorite
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-6 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">ID</div>
                                        <div className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate">#{resource.id.slice(0, 10)}</div>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Created</div>
                                        <div className="text-xs text-slate-700 dark:text-slate-200">
                                            {new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {resource.type === 'To Do' && resource.priority && (
                                        <>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Priority</div>
                                                <div className="text-xs font-semibold text-slate-900 dark:text-white">{resource.priority}</div>
                                            </div>
                                        </>
                                    )}

                                    {resource.dueDate && (
                                        <>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Due</div>
                                                <div className="text-xs text-slate-700 dark:text-slate-200">{resource.dueDate}</div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {resource.tags && resource.tags.length > 0 && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Tags</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {resource.tags.map(tag => {
                                            const color = getCategoryColor(tag);
                                            return (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs font-semibold"
                                                    style={color ? {
                                                        backgroundColor: `${color}12`,
                                                        color: color,
                                                        borderColor: `${color}30`
                                                    } : undefined}
                                                >
                                                    {tag}
                                                </Badge>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Main content */}
                        <div className="lg:col-span-8 space-y-6">
                            {(resource.description || resource.content) && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">{resource.description ? "Overview" : "Content"}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {resource.description || resource.content}
                                    </CardContent>
                                </Card>
                            )}

                            {resource.description && resource.content && resource.content !== resource.description && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Detailed content</CardTitle>
                                    </CardHeader>
                                    <CardContent className="font-mono text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                        {resource.content}
                                    </CardContent>
                                </Card>
                            )}

                            {resource.url && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Link</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/10 flex items-center justify-center shrink-0">
                                                <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {resource.url}
                                            </a>
                                        </div>
                                        <Button onClick={() => window.open(resource.url, '_blank')} className="md:ml-auto h-10 rounded-lg">
                                            Open
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {resource.images && resource.images.length > 0 && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Images</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {resource.images.map((img, i) => (
                                                <div key={i} className="aspect-square rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120]/60 flex flex-col items-center justify-center gap-2 p-3 text-slate-500 dark:text-slate-400">
                                                    <ImageIcon className="w-6 h-6 opacity-60" />
                                                    <div className="text-[10px] font-semibold uppercase tracking-widest truncate max-w-full">{img}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {resource.documents && resource.documents.length > 0 && (
                                <Card className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Attachments</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {resource.documents.map((doc, i) => (
                                            <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                                                <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-[#0b1120]/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                                                    <Paperclip className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{doc}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">File</div>
                                                </div>
                                                <Download className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
