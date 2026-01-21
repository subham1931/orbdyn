import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, FileText, CheckSquare, Mic } from "lucide-react";
import type { ResourceType, Category } from "@/types";

interface AddResourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (resource: {
        title: string;
        type: ResourceType;
        content: string;
        tags: string[];
        url?: string;
    }) => void;
    categories: Category[];
}

export default function AddResourceDialog({ isOpen, onClose, onAdd, categories }: AddResourceDialogProps) {
    const [activeTab, setActiveTab] = useState<ResourceType>("Link");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    // Reset form when dialog opens/closes or tab changes?
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setUrl("");
            setDescription("");
            setCategory("");
            setTags("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        // Basic validation
        if (!title) return;
        if (activeTab === "Link" && !url) return;

        onAdd({
            title,
            type: activeTab,
            content: description,
            tags: category ? [category, ...tags.split(",").map(t => t.trim()).filter(Boolean)] : tags.split(",").map(t => t.trim()).filter(Boolean),
            url: activeTab === "Link" ? url : undefined
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0b1120] border-slate-800 text-slate-200 sm:max-w-[600px] p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-800/50">
                    <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        Add Resource
                        {/* Close button is usually handled by Dialog primitive, but we can add one if needed or rely on default */}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResourceType)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-[#1e293b]/50 p-1 h-12 rounded-xl">
                            <TabsTrigger value="Link" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white h-10 rounded-lg transition-all">
                                <LinkIcon className="w-4 h-4" /> Link
                            </TabsTrigger>
                            <TabsTrigger value="Note" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white h-10 rounded-lg transition-all">
                                <FileText className="w-4 h-4" /> Note
                            </TabsTrigger>
                            <TabsTrigger value="To Do" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white h-10 rounded-lg transition-all">
                                <CheckSquare className="w-4 h-4" /> To Do
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6 space-y-4">
                            {activeTab === "Link" && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        URL <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl"
                                    />
                                    <p className="text-[10px] text-slate-500">
                                        Title and description will be auto-filled. PDFs will be downloaded automatically.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter a title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl pr-10"
                                    />
                                    <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Description
                                </label>
                                <div className="relative">
                                    <textarea
                                        placeholder="Add a description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-[#1e293b]/50 border border-slate-700 focus:border-blue-500 focus:outline-none text-slate-200 min-h-[100px] rounded-xl p-3 text-sm resize-none"
                                    />
                                    <Mic className="absolute right-3 bottom-3 w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-[#1e293b]/50 border border-slate-700 focus:border-blue-500 focus:outline-none text-slate-200 h-11 rounded-xl px-3 text-sm appearance-none"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Tags
                                    </label>
                                    <Input
                                        placeholder="Add tags (comma, separated)"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>

                <div className="p-6 pt-2 border-t border-slate-800/50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="h-11 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold px-6 rounded-xl shadow-lg shadow-amber-500/20">
                        Add Resource
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
