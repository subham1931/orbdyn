import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, FileText, CheckSquare, Calendar, Tag, ExternalLink } from "lucide-react";
import type { Resource, Category } from "@/types";

interface ResourceDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource | null;
    categories: Category[]; // To look up category colors
}

export default function ResourceDetailsDialog({ isOpen, onClose, resource, categories }: ResourceDetailsDialogProps) {
    if (!resource) return null;

    const getCategoryColor = (tagName: string) => {
        const category = categories.find(c => c.name === tagName);
        return category ? category.color : null;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0f172a] border-slate-800 text-slate-200 sm:max-w-[600px] p-0 overflow-hidden gap-0 shadow-2xl shadow-black/50">
                <DialogHeader className="p-6 pb-4 border-b border-slate-800/50 bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${resource.type === 'Link' ? 'bg-blue-500/10 text-blue-400' :
                                resource.type === 'Note' ? 'bg-emerald-500/10 text-emerald-400' :
                                    'bg-purple-500/10 text-purple-400'
                            }`}>
                            {resource.type === 'Link' && <LinkIcon className="w-6 h-6" />}
                            {resource.type === 'Note' && <FileText className="w-6 h-6" />}
                            {resource.type === 'To Do' && <CheckSquare className="w-6 h-6" />}
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold text-white leading-tight">
                                {resource.title}
                            </DialogTitle>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="uppercase tracking-wider">{resource.type}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6 bg-[#0f172a] min-h-[200px]">
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</h4>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {resource.content || "No description provided."}
                        </p>
                    </div>

                    {resource.url && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">URL</h4>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm break-all group"
                            >
                                <ExternalLink className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                                {resource.url}
                            </a>
                        </div>
                    )}

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map(tag => {
                                    const color = getCategoryColor(tag);
                                    return (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="border-none rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                                            style={color ? {
                                                backgroundColor: `${color}26`,
                                                color: color
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

                <DialogFooter className="p-6 pt-4 border-t border-slate-800/50 bg-[#0f172a]">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        Close
                    </Button>
                    {resource.url && (
                        <Button
                            className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-blue-500/20"
                            onClick={() => window.open(resource.url, '_blank')}
                        >
                            Open Link
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
