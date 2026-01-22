import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, FileText, CheckSquare, Mic, Image as ImageIcon, Paperclip, ChevronDown, Flag, Folder } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Resource, ResourceType, Category } from "@/types";

interface AddResourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (resource: {
        title: string;
        type: ResourceType;
        content: string;
        description?: string;
        tags: string[];
        url?: string;
        images?: string[];
        documents?: string[];
        dueDate?: string;
        dueTime?: string;
        priority?: 'Low' | 'Medium' | 'High';
    }) => void;
    categories: Category[];
    resourceToEdit?: Resource | null;
}

export default function AddResourceDialog({ isOpen, onClose, onAdd, categories, resourceToEdit }: AddResourceDialogProps) {
    const [activeTab, setActiveTab] = useState<ResourceType>("Link");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    // Note specific fields
    const [noteContent, setNoteContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [documents, setDocuments] = useState<string[]>([]);

    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    // To-Do specific fields
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

    // State for tracking prop changes to update form
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [prevResourceToEdit, setPrevResourceToEdit] = useState(resourceToEdit);

    if (isOpen !== prevIsOpen || resourceToEdit !== prevResourceToEdit) {
        setPrevIsOpen(isOpen);
        setPrevResourceToEdit(resourceToEdit);

        if (isOpen) {
            if (resourceToEdit) {
                setTitle(resourceToEdit.title);
                setUrl(resourceToEdit.url || "");
                setDescription(resourceToEdit.description || resourceToEdit.content); // Fallback logic
                setNoteContent(resourceToEdit.type === 'Note' ? resourceToEdit.content : "");
                setImages(resourceToEdit.images || []);
                setDocuments(resourceToEdit.documents || []);
                setDueDate(resourceToEdit.dueDate || "");
                setDueTime(resourceToEdit.dueTime || "");
                setPriority(resourceToEdit.priority || 'Medium');
                setActiveTab(resourceToEdit.type);

                const resourceTags = resourceToEdit.tags || [];
                const foundCategory = categories.find(c => resourceTags.includes(c.name));
                setCategory(foundCategory ? foundCategory.name : "");

                const otherTags = resourceTags.filter(t => !foundCategory || t !== foundCategory.name);
                setTags(otherTags.join(", "));
            } else {
                setTitle("");
                setUrl("");
                setDescription("");
                setNoteContent("");
                setImages([]);
                setDocuments([]);
                setDueDate("");
                setDueTime("");
                setPriority('Medium');
                setCategory("");
                setTags("");
                setActiveTab("Link");
            }
        }
    }

    const handleSubmit = () => {
        // Basic validation
        if (!title) return;
        if (activeTab === "Link" && !url) return;

        onAdd({
            title,
            type: activeTab,
            content: activeTab === 'Note' ? noteContent : description,
            description: description,
            tags: category ? [category, ...tags.split(",").map(t => t.trim()).filter(Boolean)] : tags.split(",").map(t => t.trim()).filter(Boolean),
            url: activeTab === "Link" ? url : undefined,
            images: images,
            documents: documents,
            dueDate: activeTab === 'To Do' ? dueDate : undefined,
            dueTime: activeTab === 'To Do' ? dueTime : undefined,
            priority: activeTab === 'To Do' ? priority : undefined,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 sm:max-w-[600px] max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 transition-colors">
                <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                    <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        {resourceToEdit ? "Edit Resource" : "Add Resource"}
                        {/* Close button is usually handled by Dialog primitive, but we can add one if needed or rely on default */}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResourceType)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-[#1e293b]/50 p-1 h-12 rounded-xl">
                            <TabsTrigger value="Link" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-10 rounded-lg transition-all text-slate-500 dark:text-slate-400">
                                <LinkIcon className="w-4 h-4" /> Link
                            </TabsTrigger>
                            <TabsTrigger value="Note" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-10 rounded-lg transition-all text-slate-500 dark:text-slate-400">
                                <FileText className="w-4 h-4" /> Note
                            </TabsTrigger>
                            <TabsTrigger value="To Do" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-10 rounded-lg transition-all text-slate-500 dark:text-slate-400">
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
                                        className="bg-slate-50 dark:bg-[#1e293b]/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-slate-200 h-11 rounded-xl transition-colors"
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
                                        className="bg-slate-50 dark:bg-[#1e293b]/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-slate-200 h-11 rounded-xl pr-10 transition-colors"
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
                                        placeholder="Add a short description/summary..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 min-h-[80px] rounded-xl p-3 text-sm resize-none transition-colors"
                                    />
                                </div>
                            </div>

                            {(activeTab === "Note" || activeTab === "To Do") && (
                                <>
                                    {activeTab === "Note" && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Content
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    placeholder="Write your note here..."
                                                    value={noteContent}
                                                    onChange={(e) => setNoteContent(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-200 min-h-[150px] rounded-xl p-3 text-sm resize-none font-mono transition-colors"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "To Do" && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Due Date
                                                </label>
                                                <Input
                                                    type="date"
                                                    value={dueDate}
                                                    onChange={(e) => setDueDate(e.target.value)}
                                                    className="bg-slate-50 dark:bg-[#1e293b]/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-slate-200 h-11 rounded-xl dark:[color-scheme:dark] transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Due Time
                                                </label>
                                                <Input
                                                    type="time"
                                                    value={dueTime}
                                                    onChange={(e) => setDueTime(e.target.value)}
                                                    className="bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl [color-scheme:dark]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Priority
                                                </label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full justify-between h-11 rounded-xl bg-slate-50 dark:bg-[#1e293b]/50 border-slate-200 dark:border-slate-700 font-bold transition-colors ${priority === 'High' ? 'text-rose-500 border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-[#1e293b]/50' :
                                                                priority === 'Medium' ? 'text-amber-500 border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-[#1e293b]/50' :
                                                                    'text-emerald-500 border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-[#1e293b]/50'
                                                                }`}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <Flag className="w-4 h-4" />
                                                                {priority}
                                                            </span>
                                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 w-[180px] p-1.5 shadow-xl transition-colors" align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => setPriority('Low')}
                                                            className="text-emerald-500 focus:text-emerald-400 focus:bg-emerald-500/10 gap-3 rounded-lg py-2 font-semibold cursor-pointer"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Low
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setPriority('Medium')}
                                                            className="text-amber-500 focus:text-amber-400 focus:bg-amber-500/10 gap-3 rounded-lg py-2 font-semibold cursor-pointer"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setPriority('High')}
                                                            className="text-rose-500 focus:text-rose-400 focus:bg-rose-500/10 gap-3 rounded-lg py-2 font-semibold cursor-pointer"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-rose-500" /> High
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Images
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setImages([...images, file.name]);
                                                    }}
                                                    className="pl-10 bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                                                />
                                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            {images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {images.map((img, i) => (
                                                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full flex items-center gap-1">
                                                            <ImageIcon className="w-3 h-3" /> {img}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Documents
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setDocuments([...documents, file.name]);
                                                    }}
                                                    className="pl-10 bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                                                />
                                                <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            {documents.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {documents.map((doc, i) => (
                                                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> {doc}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Category
                                    </label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between h-11 rounded-xl bg-[#1e293b]/50 border-slate-700 text-slate-300 font-medium hover:bg-[#1e293b]/50 hover:text-slate-300"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Folder className="w-4 h-4 text-slate-500" />
                                                    {category || "Select a category"}
                                                </span>
                                                <ChevronDown className="w-4 h-4 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 w-[240px] p-1.5 shadow-xl transition-colors" align="start">
                                            <DropdownMenuItem
                                                onClick={() => setCategory("")}
                                                className="text-slate-500 dark:text-slate-400 focus:text-slate-900 dark:focus:text-white focus:bg-slate-100 dark:focus:bg-slate-800 gap-3 rounded-lg py-2 cursor-pointer transition-colors"
                                            >
                                                <Folder className="w-4 h-4" /> None
                                            </DropdownMenuItem>
                                            {categories.map((cat) => (
                                                <DropdownMenuItem
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.name)}
                                                    className="text-slate-300 focus:text-white focus:bg-slate-800 gap-3 rounded-lg py-2 cursor-pointer"
                                                >
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                                    {cat.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

                <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex justify-end gap-3 transition-colors">
                    <Button variant="ghost" onClick={onClose} className="h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="h-11 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold px-6 rounded-xl shadow-lg shadow-amber-500/20">
                        {resourceToEdit ? "Save Changes" : "Add Resource"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
