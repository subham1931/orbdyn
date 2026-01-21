import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    Layout,
    Folder,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import SettingsPage from "./SettingsPage";
import AddResourceDialog from "./AddResourceDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import ResourceDetailView from "./ResourceDetailView";
import type { Resource, ResourceType, Category } from "@/types";

interface DashboardProps {
    onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("All Resources");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const [resources, setResources] = useState<Resource[]>(() => {
        try {
            const saved = localStorage.getItem("orbdyn_resources");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse resources from local storage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("orbdyn_resources", JSON.stringify(resources));
    }, [resources]);

    const [categories, setCategories] = useState<Category[]>(() => {
        try {
            const saved = localStorage.getItem("orbdyn_categories");
            if (!saved) {
                return [];
            }
            const parsed = JSON.parse(saved);
            // Handle legacy string array support
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                return parsed.map((name: string, index: number) => ({
                    id: Date.now().toString() + index,
                    name,
                    color: "#3b82f6" // Default blue
                }));
            }
            return parsed;
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("orbdyn_categories", JSON.stringify(categories));
    }, [categories]);

    const handleSaveCategory = (categoryData: Omit<Category, "id">) => {
        if (editingCategory) {
            // Update active tab if we're editing the currently active category
            if (activeTab === editingCategory.name) {
                setActiveTab(categoryData.name);
            }

            // Edit mode
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...categoryData }
                    : c
            ));
            setEditingCategory(null);
        } else {
            // Add mode
            const newCategory: Category = {
                id: Date.now().toString(),
                ...categoryData
            };
            setCategories([...categories, newCategory]);
        }
        setIsCategoryDialogOpen(false);
    };

    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
    };

    const confirmDeleteCategory = () => {
        if (categoryToDelete) {
            setCategories(categories.filter(c => c.id !== categoryToDelete.id));
            if (activeTab === categoryToDelete.name) {
                setActiveTab("All Resources");
            }
            setCategoryToDelete(null);
        }
    };

    const openEditCategoryDialog = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    };

    const openAddCategoryDialog = () => {
        setEditingCategory(null);
        setIsCategoryDialogOpen(true);
    };

    const handleAddResource = (resourceData: {
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
    }) => {
        if (editingResource) {
            // Update existing resource
            setResources(resources.map(r =>
                r.id === editingResource.id
                    ? {
                        ...r,
                        ...resourceData,
                        content: resourceData.content || (resourceData.url ? resourceData.url : ""),
                        description: resourceData.description,
                        images: resourceData.images,
                        documents: resourceData.documents,
                        dueDate: resourceData.dueDate,
                        dueTime: resourceData.dueTime,
                        priority: resourceData.priority
                    }
                    : r
            ));
            setEditingResource(null);
        } else {
            // Create new resource
            const newResource: Resource = {
                id: Date.now().toString(),
                title: resourceData.title,
                type: resourceData.type,
                content: resourceData.content || (resourceData.url ? resourceData.url : ""),
                description: resourceData.description,
                createdAt: Date.now(),
                tags: resourceData.tags,
                isFavorite: false,
                isArchived: false,
                url: resourceData.url,
                images: resourceData.images,
                documents: resourceData.documents,
                dueDate: resourceData.dueDate,
                dueTime: resourceData.dueTime,
                priority: resourceData.priority
            };
            setResources([newResource, ...resources]);
        }
    };

    const handleEditResource = (resource: Resource) => {
        setEditingResource(resource);
        setIsAddDialogOpen(true);
    };

    const handleDeleteResource = (id: string) => {
        if (confirm("Are you sure you want to delete this resource?")) {
            setResources(resources.filter(r => r.id !== id));
        }
    };

    const handleArchiveResource = (id: string) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, isArchived: !r.isArchived } : r
        ));
    };

    const handleExportResource = (resource: Resource, format: 'json' | 'md' | 'pdf' = 'json') => {
        let content = "";
        let contentType = "";
        let extension = "";

        if (format === 'json') {
            content = JSON.stringify(resource, null, 2);
            contentType = "application/json";
            extension = "json";
        } else if (format === 'md') {
            content = `# ${resource.title}\n\nType: ${resource.type}\n\n${resource.description || ''}\n\n${resource.content}\n\n${resource.url ? `URL: ${resource.url}` : ''}`;
            contentType = "text/markdown";
            extension = "md";
        } else if (format === 'pdf') {
            // Simple text representation for PDF simulation if no library is present
            content = `RESOURCE: ${resource.title}\nTYPE: ${resource.type}\n\n${resource.description || ''}\n\n${resource.content}`;
            contentType = "application/pdf";
            extension = "pdf";
        }

        const dataStr = `data:${contentType};charset=utf-8,` + encodeURIComponent(content);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${resource.title.replace(/\s+/g, '_')}.${extension}`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleShareResource = (resource: Resource) => {
        const textToShare = `${resource.title}\n${resource.content}\n${resource.url || ''}`;
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.content,
                url: resource.url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(textToShare).then(() => {
                alert("Resource details copied to clipboard!");
            });
        }
    };

    const toggleFavorite = (id: string) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
        ));
    };

    const filteredResources = resources.filter(r => {
        if (activeTab === "All Resources") return !r.isArchived;
        if (activeTab === "Links") return r.type === "Link" && !r.isArchived;
        if (activeTab === "Notes") return r.type === "Note" && !r.isArchived;
        if (activeTab === "To Do") return r.type === "To Do" && !r.isArchived;
        if (activeTab === "Favorites") return r.isFavorite && !r.isArchived;
        if (activeTab === "Archive") return r.isArchived;

        // Filter by category (checking if category name exists in tags)
        if (categories.some(c => c.name === activeTab)) {
            return r.tags?.includes(activeTab) && !r.isArchived;
        }

        return false;
    });

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
            {/* ... Sidebar ... */}

            <aside className="w-64 border-r border-slate-900 flex flex-col z-20">
                {/* ... Sidebar Content ... */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black tracking-wider text-white uppercase font-sans">Orbdyn</span>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-4 mt-6">
                    <div className="space-y-1 mb-6">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${activeTab === item.name
                                    ? "text-blue-400 bg-blue-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {activeTab === item.name && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full" />
                                )}
                                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.name ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="pb-4">
                        <div className="flex items-center justify-between px-3 mb-2">
                            <button
                                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                className="flex items-center gap-2 group cursor-pointer hover:text-slate-300 transition-colors"
                            >
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                                    Categories
                                </span>
                                <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 group-hover:text-slate-400 ${!isCategoriesExpanded ? '-rotate-90' : ''}`} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAddCategoryDialog();
                                }}
                                className="p-1 rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {isCategoriesExpanded && (
                            <div className="animate-in slide-in-from-top-2 duration-300 fade-in space-y-1">
                                <div className="space-y-0.5 mb-3">
                                    {categories.map((category) => (
                                        <div key={category.id} className="group relative flex items-center">
                                            <div
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === category.name
                                                    ? "text-white bg-white/10"
                                                    : "text-slate-400"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTab === category.name ? 'scale-125 shadow-[0_0_8px_rgba(0,0,0,0.5)]' : ''}`}
                                                    style={{
                                                        backgroundColor: category.color,
                                                        boxShadow: activeTab === category.name ? `0 0 10px ${category.color}` : 'none'
                                                    }}
                                                />
                                                <span className="truncate flex-1 text-left">{category.name}</span>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-all">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 bg-[#0f172a] border-slate-800 text-slate-200 shadow-xl shadow-black/50">
                                                    <DropdownMenuItem onClick={() => openEditCategoryDialog(category)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer gap-2 text-xs font-medium">
                                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCategory(category)} className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer gap-2 text-xs font-medium">
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        )}
                    </div>
                </ScrollArea>

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
                        <Button onClick={() => setIsAddDialogOpen(true)} className="h-9 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg gap-2 font-bold px-5 ml-2 border-none">
                            <Plus className="w-4 h-4" /> Add
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {activeTab === "Settings" ? (
                        <SettingsPage onSignOut={onSignOut} />
                    ) : selectedResource ? (
                        <div className="flex-1 p-6 h-full overflow-hidden">
                            <ResourceDetailView
                                resource={selectedResource}
                                onBack={() => setSelectedResource(null)}
                                categories={categories}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col p-8">
                            {filteredResources.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
                                    {filteredResources.map((resource) => (
                                        <Card
                                            key={resource.id}
                                            onClick={() => setSelectedResource(resource)}
                                            className="group relative bg-[#0f172a] border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden cursor-pointer"
                                        >
                                            <CardHeader className="pb-3 relative">
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite(resource.id);
                                                        }}
                                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-yellow-400 transition-colors"
                                                    >
                                                        <Star className={`w-4 h-4 ${resource.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                                    </button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-[#0f172a] border-slate-800 text-slate-200 shadow-xl shadow-black/50 p-1.5">
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedResource(resource); }} className="group hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300">
                                                                <Eye className="w-3.5 h-3.5 text-slate-400 group-focus:text-white transition-colors" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditResource(resource); }} className="group hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300">
                                                                <Pencil className="w-3.5 h-3.5 text-slate-400 group-focus:text-white transition-colors" /> Edit Resource
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-slate-800 my-1.5 mx-1" />
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger className="hover:bg-blue-600 focus:bg-blue-600 data-[state=open]:bg-blue-600 hover:text-white focus:text-white data-[state=open]:text-white cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300">
                                                                    <Download className="w-3.5 h-3.5 transition-colors" /> Export
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuPortal>
                                                                    <DropdownMenuSubContent className="bg-[#0f172a] border-slate-800 text-slate-200 shadow-xl p-1.5 min-w-[140px]">
                                                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'json'); }} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300 hover:text-slate-300 focus:text-slate-300">
                                                                            As JSON
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'md'); }} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300 hover:text-slate-300 focus:text-slate-300">
                                                                            As Markdown
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'pdf'); }} className="bg-blue-600 hover:bg-blue-600 focus:bg-blue-600 text-white cursor-pointer text-xs font-bold px-2.5 py-2 rounded-md transition-colors">
                                                                            As PDF
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuSubContent>
                                                                </DropdownMenuPortal>
                                                            </DropdownMenuSub>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareResource(resource); }} className="group hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300">
                                                                <Share2 className="w-3.5 h-3.5 text-slate-400 group-focus:text-white transition-colors" /> Share
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchiveResource(resource.id); }} className="group hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-300">
                                                                <Archive className="w-3.5 h-3.5 text-slate-400 group-focus:text-white transition-colors" /> {resource.isArchived ? "Unarchive" : "Archive"}
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-slate-800 my-1.5 mx-1" />
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource.id); }} className="group hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer gap-2.5 text-xs font-medium px-2.5 py-2 rounded-md transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5 group-focus:text-red-400 transition-colors" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${resource.type === 'Link' ? 'bg-blue-500/10 text-blue-400' :
                                                    resource.type === 'Note' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                    {resource.type === 'Link' && <LinkIcon className="w-5 h-5" />}
                                                    {resource.type === 'Note' && <FileText className="w-5 h-5" />}
                                                    {resource.type === 'To Do' && <CheckSquare className="w-5 h-5" />}
                                                </div>
                                                <CardTitle className="text-lg font-bold text-white pt-4 line-clamp-1 border-none">{resource.title}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="pb-4">
                                                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                                    {resource.content}
                                                </p>
                                            </CardContent>

                                            <CardFooter className="pt-4 border-t border-slate-800/50 flex justify-between items-center bg-[#020617]/20">
                                                <div className="flex gap-2 flex-wrap">
                                                    {resource.tags?.map(tag => {
                                                        const category = categories.find(c => c.name === tag);
                                                        return (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className={`border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${!category ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200' : ''}`}
                                                                style={category ? {
                                                                    backgroundColor: `${category.color}26`, // ~15% opacity
                                                                    color: category.color
                                                                } : undefined}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">
                                                    {new Date(resource.createdAt).toLocaleDateString()}
                                                </span>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-start pt-20">
                                    <div className="max-w-sm w-full text-center space-y-4">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-slate-900 border border-slate-800 text-slate-500 shadow-inner mb-2">
                                            {activeTab === "Links" ? <LinkIcon className="w-8 h-8" /> :
                                                activeTab === "Notes" ? <FileText className="w-8 h-8" /> :
                                                    activeTab === "To Do" ? <CheckSquare className="w-8 h-8" /> :
                                                        activeTab === "Favorites" ? <Star className="w-8 h-8" /> :
                                                            activeTab === "Archive" ? <Archive className="w-8 h-8" /> :
                                                                <Folder className="w-8 h-8" />}
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold text-white tracking-tight">
                                                {activeTab === "All Resources" ? "No resources yet" : `No ${activeTab.toLowerCase()} yet`}
                                            </h2>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                                {activeTab === "All Resources"
                                                    ? "Start building your journal by adding links, notes, and professional resources."
                                                    : `You haven't added any ${activeTab.toLowerCase()} to your collection yet.`}
                                            </p>
                                        </div>
                                        <Button onClick={() => setIsAddDialogOpen(true)} className="h-11 bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 rounded-xl font-bold text-sm shadow-xl shadow-amber-500/10 group border-none mt-2">
                                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform mr-2" />
                                            Add Resource
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ambient background decoration */}
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

                <AddResourceDialog
                    isOpen={isAddDialogOpen}
                    onClose={() => {
                        setIsAddDialogOpen(false);
                        setEditingResource(null);
                    }}
                    onAdd={handleAddResource}
                    categories={categories}
                    resourceToEdit={editingResource}
                />

                <AddCategoryDialog
                    isOpen={isCategoryDialogOpen}
                    onClose={() => {
                        setIsCategoryDialogOpen(false);
                        setEditingCategory(null);
                    }}
                    onSave={handleSaveCategory}
                    categoryToEdit={editingCategory}
                />

                <DeleteCategoryDialog
                    isOpen={!!categoryToDelete}
                    onClose={() => setCategoryToDelete(null)}
                    onConfirm={confirmDeleteCategory}
                    categoryName={categoryToDelete?.name}
                />

            </main>
        </div>
    );
}
