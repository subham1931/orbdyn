import { useState, useEffect, useRef } from "react";
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
    Calendar,
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
    Share2,
    Home,
    RotateCcw
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

import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import AddResourceDialog from "./AddResourceDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import DeleteResourceDialog from "./DeleteResourceDialog";
import ResourceDetailView from "./ResourceDetailView";
import ValidationDialog from "./ValidationDialog";
import type { Resource, ResourceType, Category } from "@/types";

interface DashboardProps {
    onSignOut: () => void;
}

type SortOption = 'custom' | 'title-az' | 'title-za' | 'date-newest' | 'date-oldest' | 'favorites-first' | 'priority-high' | 'type';

export default function Dashboard({ onSignOut }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("Main");
    const [user] = useState<{ name: string; email: string; avatar: string }>(() => {
        const stored = localStorage.getItem("orbdyn_user");
        return stored ? JSON.parse(stored) : {
            name: "Subham",
            email: "subham019650@gmail.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Subham"
        };
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [filterDateFrom, setFilterDateFrom] = useState<string>("");
    const [filterDateTo, setFilterDateTo] = useState<string>("");
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('date-newest');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(new Set());
    const filterRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const [currentImportType, setCurrentImportType] = useState<'json' | 'md' | 'pdf' | null>(null);
    const [validationError, setValidationError] = useState<{ title: string; description: string } | null>(null);

    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("orbdyn_theme");
        return (saved as "light" | "dark") || "dark";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("orbdyn_theme", theme);
    }, [theme]);

    const [resources, setResources] = useState<Resource[]>(() => {
        try {
            const saved = localStorage.getItem("orbdyn_resources");
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
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
            if (!saved) return [];
            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) return [];

            // Handle legacy string array support
            if (parsed.length > 0 && typeof parsed[0] === 'string') {
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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterPopoverOpen(false);
            }
        }
        if (isFilterPopoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFilterPopoverOpen]);

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
        // Validation: Check for duplicate title (case-insensitive)
        const isDuplicate = resources.some(r =>
            r.title.toLowerCase() === resourceData.title.toLowerCase() &&
            (!editingResource || r.id !== editingResource.id)
        );

        if (isDuplicate) {
            setValidationError({
                title: "Duplicate Title",
                description: `A resource with the title "${resourceData.title}" already exists in your collection (or Recycle Bin). Each resource must have a unique identifier.`
            });
            return;
        }

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
            setIsAddDialogOpen(false); // Close dialog on success
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
            setIsAddDialogOpen(false); // Close dialog on success
        }
    };

    const handleEditResource = (resource: Resource) => {
        setEditingResource(resource);
        setIsAddDialogOpen(true);
    };

    const handleDeleteResource = (resource: Resource) => {
        setResourceToDelete(resource);
    };

    const confirmDeleteResource = () => {
        if (resourceToDelete) {
            if (resourceToDelete.isDeleted) {
                // Permanent delete
                setResources(resources.filter(r => r.id !== resourceToDelete.id));
            } else {
                // Move to trash
                setResources(resources.map(r =>
                    r.id === resourceToDelete.id
                        ? { ...r, isDeleted: true, deletedAt: Date.now() }
                        : r
                ));
            }
            if (selectedResource?.id === resourceToDelete.id) {
                setSelectedResource(null);
            }
            setResourceToDelete(null);
        }
    };

    const handleRestoreResource = (id: string) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, isDeleted: false, deletedAt: undefined } : r
        ));
    };

    const handleArchiveResource = (id: string) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, isArchived: !r.isArchived } : r
        ));
    };

    const handleBulkDelete = () => {
        if (selectedResourceIds.size === 0) return;
        if (activeTab === "Recycle Bin") {
            setResources(resources.filter(r => !selectedResourceIds.has(r.id)));
        } else {
            setResources(resources.map(r =>
                selectedResourceIds.has(r.id)
                    ? { ...r, isDeleted: true, deletedAt: Date.now() }
                    : r
            ));
        }
        setSelectedResourceIds(new Set());
        setIsSelectionMode(false);
    };

    const handleImportClick = (type: 'json' | 'md' | 'pdf') => {
        setCurrentImportType(type);
        if (importInputRef.current) {
            importInputRef.current.value = '';
            importInputRef.current.click();
        }
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentImportType) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result;
            if (typeof content !== 'string') return;

            const existingTitles = new Set(resources.map(r => r.title.toLowerCase()));

            if (currentImportType === 'json') {
                try {
                    const data = JSON.parse(content);
                    const additions: Resource[] = [];
                    const duplicates: string[] = [];

                    const processItem = (item: Partial<Resource>) => {
                        const title = item.title || "Imported Resource";
                        if (existingTitles.has(title.toLowerCase())) {
                            duplicates.push(title);
                            return;
                        }

                        const res: Resource = {
                            id: (item.id || Date.now() + Math.random()).toString(),
                            title: title,
                            type: item.type || "Note",
                            content: item.content || item.url || "No content",
                            createdAt: item.createdAt || Date.now(),
                            tags: Array.isArray(item.tags) ? item.tags : ["Imported"],
                            url: item.url,
                            description: item.description,
                            isFavorite: !!item.isFavorite,
                            isArchived: !!item.isArchived,
                            isDeleted: !!item.isDeleted,
                            priority: item.priority || 'Medium'
                        };
                        additions.push(res);
                        existingTitles.add(title.toLowerCase());
                    };

                    if (Array.isArray(data)) {
                        data.forEach(processItem);
                    } else {
                        processItem(data);
                    }

                    if (duplicates.length > 0) {
                        setValidationError({
                            title: "Duplicate Detected",
                            description: duplicates.length === 1
                                ? `The resource "${duplicates[0]}" was skipped because it already exists in your collection.`
                                : `${duplicates.length} items were skipped because they already exist in your collection: ${duplicates.join(", ")}`
                        });
                    }

                    if (additions.length > 0) {
                        setResources(prev => [...additions, ...prev]);
                    }
                } catch (err) {
                    console.error("Failed to parse JSON:", err);
                }
            } else if (currentImportType === 'md') {
                const title = file.name.replace(/\.[^/.]+$/, "");
                if (existingTitles.has(title.toLowerCase())) {
                    setValidationError({
                        title: "Already Exists",
                        description: `A resource titled "${title}" is already in your collection. Please rename your Markdown file or the existing resource to proceed.`
                    });
                    return;
                }

                const newRes: Resource = {
                    id: Date.now().toString(),
                    title: title,
                    type: "Note",
                    content: content,
                    createdAt: Date.now(),
                    tags: ["Imported", "Markdown"],
                    priority: 'Medium'
                };
                setResources(prev => [newRes, ...prev]);
            } else if (currentImportType === 'pdf') {
                const title = file.name.replace(/\.[^/.]+$/, "");
                if (existingTitles.has(title.toLowerCase())) {
                    setValidationError({
                        title: "Already Exists",
                        description: `A resource titled "${title}" is already in your collection. Please rename your PDF file or the existing resource to proceed.`
                    });
                    return;
                }

                const newRes: Resource = {
                    id: Date.now().toString(),
                    title: title,
                    type: "Note",
                    content: `Reference to: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nImported on: ${new Date().toLocaleString()}`,
                    createdAt: Date.now(),
                    tags: ["Imported", "PDF"],
                    priority: 'Medium'
                };
                setResources(prev => [newRes, ...prev]);
            }
        };

        reader.readAsText(file);
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

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedResourceIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedResourceIds(newSelected);
    };

    const handleBulkMove = (categoryName: string) => {
        setResources(resources.map(r => {
            if (selectedResourceIds.has(r.id)) {
                // Keep tags that aren't categories, and add the new category
                const otherTags = (r.tags || []).filter(t => !categories.some(c => c.name === t));
                return { ...r, tags: [categoryName, ...otherTags] };
            }
            return r;
        }));
        setSelectedResourceIds(new Set());
    };

    const filteredResources = resources.filter(r => {
        // Search filter
        const searchTarget = `${r.title} ${r.description || ""} ${r.content}`.toLowerCase();
        if (searchQuery && !searchTarget.includes(searchQuery.toLowerCase())) return false;

        // View filter (Sidebar tabs)
        let matchesTab = false;
        const isArchived = !!r.isArchived;
        const isFavorite = !!r.isFavorite;
        const isDeleted = !!r.isDeleted;

        // If we are in Recycle Bin, only show deleted items
        if (activeTab === "Recycle Bin") {
            matchesTab = isDeleted;
        } else {
            // In any other tab, never show deleted items
            if (isDeleted) return false;

            if (activeTab === "All Resources") matchesTab = !isArchived;
            else if (activeTab === "Links") matchesTab = r.type === "Link" && !isArchived;
            else if (activeTab === "Notes") matchesTab = r.type === "Note" && !isArchived;
            else if (activeTab === "To Do") matchesTab = r.type === "To Do" && !isArchived;
            else if (activeTab === "Favorites") matchesTab = isFavorite && !isArchived;
            else if (activeTab === "Archive") matchesTab = isArchived;
            else if (categories.some(c => c.name === activeTab)) {
                matchesTab = (r.tags?.includes(activeTab) ?? false) && !isArchived;
            }
        }

        if (!matchesTab) return false;

        // Category filter (independent of activeTab)
        if (filterCategory !== "All" && !(r.tags?.includes(filterCategory) ?? false)) return false;

        // Date range filter
        if (filterDateFrom) {
            const fromDate = new Date(filterDateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (new Date(r.createdAt) < fromDate) return false;
        }
        if (filterDateTo) {
            const toDate = new Date(filterDateTo);
            toDate.setHours(23, 59, 59, 999);
            if (new Date(r.createdAt) > toDate) return false;
        }

        return true;
    });

    const sortedResources = [...filteredResources].sort((a, b) => {
        switch (sortBy) {
            case 'title-az': return a.title.localeCompare(b.title);
            case 'title-za': return b.title.localeCompare(a.title);
            case 'date-newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'date-oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'favorites-first':
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return 0;
            case 'priority-high': {
                const priorityOrder = { High: 0, Medium: 1, Low: 2, undefined: 3 };
                const ap = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
                const bp = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
                return ap - bp;
            }
            case 'type':
                return a.type.localeCompare(b.type);
            case 'custom':
            default:
                return 0;
        }
    });

    const menuItems = [
        { name: "Main", icon: Home },
        { name: "All Resources", icon: LayoutGrid },
        { name: "Links", icon: LinkIcon },
        { name: "Notes", icon: FileText },
        { name: "To Do", icon: CheckSquare },
        { name: "Favorites", icon: Star },
        { name: "Archive", icon: Archive },
        { name: "Recycle Bin", icon: Trash2 },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-300">
            {/* ... Sidebar ... */}

            <aside className="w-64 border-r border-slate-200 dark:border-slate-900 flex flex-col bg-white dark:bg-[#020617] z-20 transition-colors duration-300">
                {/* ... Sidebar Content ... */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white uppercase font-sans">Orbdyn</span>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-4 mt-6">
                    <div className="space-y-1 mb-6">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${activeTab === item.name
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {activeTab === item.name && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full" />
                                )}
                                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.name ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
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
                                                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
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
                                                    <button className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-xl shadow-slate-200 dark:shadow-black/50 transition-colors">
                                                    <DropdownMenuItem onClick={() => openEditCategoryDialog(category)} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCategory(category)} className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-500 dark:text-red-400 cursor-pointer gap-2 text-xs font-medium">
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

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <button
                        onClick={() => setActiveTab("Profile")}
                        className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-xl transition-all group ${activeTab === "Profile"
                            ? "bg-blue-500/10"
                            : "hover:bg-slate-100 dark:hover:bg-white/5"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 transition-transform group-hover:scale-110 ${activeTab === "Profile" ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#020617]" : ""}`}>
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 text-left">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("Settings")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "Settings"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between px-8 bg-white/70 dark:bg-[#020617]/50 backdrop-blur-xl shrink-0 relative z-20 transition-colors duration-300">
                    <div className="relative w-96 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-[#1e293b] h-10 pl-10 rounded-lg focus:ring-1 focus:ring-blue-500/50 shadow-sm dark:shadow-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-600 text-sm w-full text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative" ref={filterRef}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                                className={`h-9 bg-transparent border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors ${isFilterPopoverOpen ? 'bg-slate-100 dark:bg-[#1e293b] text-slate-900 dark:text-white border-blue-500/50' : ''}`}
                            >
                                <Filter className="w-3.5 h-3.5" /> Filters
                                {(filterCategory !== "All" || filterDateFrom || filterDateTo) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                )}
                            </Button>

                            {isFilterPopoverOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200 transition-colors">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Advanced Filters</h3>
                                            <button
                                                onClick={() => {
                                                    setFilterCategory("All");
                                                    setFilterDateFrom("");
                                                    setFilterDateTo("");
                                                }}
                                                className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">By Category</label>
                                            <select
                                                value={filterCategory}
                                                onChange={(e) => setFilterCategory(e.target.value)}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer transition-colors"
                                            >
                                                <option value="All">All Categories</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date Range</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">From</span>
                                                    <input
                                                        type="date"
                                                        value={filterDateFrom}
                                                        onChange={(e) => setFilterDateFrom(e.target.value)}
                                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-[11px] text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:[color-scheme:dark] transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">To</span>
                                                    <input
                                                        type="date"
                                                        value={filterDateTo}
                                                        onChange={(e) => setFilterDateTo(e.target.value)}
                                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-[11px] text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:[color-scheme:dark] transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                onClick={() => setIsFilterPopoverOpen(false)}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 rounded-xl shadow-lg shadow-blue-500/20"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 bg-transparent border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b] data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-[#1e293b] data-[state=open]:text-slate-900 dark:data-[state=open]:text-white rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                    {sortBy === 'custom' ? 'Custom' :
                                        sortBy === 'title-az' ? 'Title (A-Z)' :
                                            sortBy === 'title-za' ? 'Title (Z-A)' :
                                                sortBy === 'date-newest' ? 'Newest' :
                                                    sortBy === 'date-oldest' ? 'Oldest' :
                                                        sortBy === 'favorites-first' ? 'Favorites' :
                                                            sortBy === 'priority-high' ? 'Priority' : 'Type'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-xl p-1.5 min-w-[160px] transition-colors">
                                <DropdownMenuItem onClick={() => setSortBy('custom')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'custom' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Custom Order
                                </DropdownMenuItem>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                                <DropdownMenuItem onClick={() => setSortBy('title-az')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'title-az' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Title (A-Z)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('title-za')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'title-za' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Title (Z-A)
                                </DropdownMenuItem>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                                <DropdownMenuItem onClick={() => setSortBy('date-newest')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'date-newest' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Date Created (Newest)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('date-oldest')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'date-oldest' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Date Created (Oldest)
                                </DropdownMenuItem>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                                <DropdownMenuItem onClick={() => setSortBy('favorites-first')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'favorites-first' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Favorites First
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('priority-high')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'priority-high' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Priority (High to Low)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('type')} className={`hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors ${sortBy === 'type' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Type (A-Z)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 bg-transparent border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-[#1e293b] data-[state=open]:text-slate-900 dark:data-[state=open]:text-white rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-xl p-1.5 min-w-[140px] transition-colors">
                                <DropdownMenuItem onClick={() => { }} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                                    As JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { }} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                                    As Markdown
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { }} className="hover:bg-blue-600 focus:bg-blue-600 focus:text-white cursor-pointer text-xs font-bold px-2.5 py-2 rounded-md transition-colors text-slate-700 dark:text-slate-300">
                                    As PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 bg-transparent border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-colors">
                                    <Upload className="w-3.5 h-3.5" /> Import
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-xl p-1.5 min-w-[140px] transition-colors">
                                <DropdownMenuItem onClick={() => handleImportClick('json')} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-600 dark:text-slate-300 gap-2">
                                    <FileText className="w-3.5 h-3.5 opacity-50" /> From JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleImportClick('md')} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-600 dark:text-slate-300 gap-2">
                                    <FileText className="w-3.5 h-3.5 opacity-50" /> From Markdown
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleImportClick('pdf')} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-medium px-2.5 py-2 rounded-md transition-colors text-slate-600 dark:text-slate-300 gap-2">
                                    <FileText className="w-3.5 h-3.5 opacity-50" /> From PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                if (isSelectionMode) setSelectedResourceIds(new Set());
                            }}
                            className={`h-9 bg-transparent border-slate-200 dark:border-[#1e293b] rounded-lg gap-2 font-medium px-4 text-xs transition-all ${isSelectionMode ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b]'}`}
                        >
                            <CheckSquare className="w-3.5 h-3.5" /> {isSelectionMode ? 'Cancel Selection' : 'Select'}
                        </Button>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="h-9 bg-[#f59e0b] hover:bg-[#d97706] text-black rounded-lg gap-2 font-bold px-5 ml-2 border-none">
                            <Plus className="w-4 h-4" /> Add
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    {activeTab === "Settings" ? (
                        <SettingsPage theme={theme} onThemeChange={setTheme} />
                    ) : activeTab === "Main" ? (
                        <div className="flex-1 flex flex-col p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user.name}</span>!
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
                                    Here's what's happening with your resources today. Your private digital library is growing.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: "Total Resources", value: resources.length, icon: LayoutGrid, color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { label: "Links Saved", value: resources.filter(r => r.type === 'Link').length, icon: LinkIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                    { label: "Notes Written", value: resources.filter(r => r.type === 'Note').length, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
                                    { label: "Favorites", value: resources.filter(r => r.isFavorite).length, icon: Star, color: "text-rose-500", bg: "bg-rose-500/10" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
                                    <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50" onClick={() => setActiveTab("All Resources")}>View All</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {resources.filter(r => !r.isDeleted).slice(0, 3).map(resource => (
                                        <Card
                                            key={resource.id}
                                            className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-none hover:-translate-y-1 cursor-pointer overflow-hidden group rounded-[1.75rem] border-none ring-1 ring-slate-200 dark:ring-slate-800"
                                            onClick={() => setSelectedResource(resource)}
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl -mr-12 -mt-12 group-hover:from-blue-500/10 transition-colors" />
                                            <CardHeader className="p-5 pb-1">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${resource.type === 'Link' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/5' :
                                                    resource.type === 'Note' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/5' :
                                                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/5'
                                                    }`}>
                                                    {resource.type === 'Link' && <LinkIcon className="w-5 h-5" />}
                                                    {resource.type === 'Note' && <FileText className="w-5 h-5" />}
                                                    {resource.type === 'To Do' && <CheckSquare className="w-5 h-5" />}
                                                </div>
                                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{resource.title}</CardTitle>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">{resource.description || 'Securely archived in your vault.'}</p>
                                            </CardHeader>
                                            <CardFooter className="px-5 py-3 flex justify-between items-center bg-slate-50/50 dark:bg-[#020617]/40 mt-2 border-t border-slate-100 dark:border-slate-800/50">
                                                <Badge className="bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-none px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-widest rounded-md">
                                                    {resource.tags?.[0] || 'Unsorted'}
                                                </Badge>
                                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{new Date(resource.createdAt).toLocaleDateString()}</span>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "Profile" ? (
                        <ProfilePage user={user} onSignOut={onSignOut} />
                    ) : selectedResource ? (
                        <div className="flex-1 h-full overflow-hidden">
                            <ResourceDetailView
                                resource={selectedResource}
                                onBack={() => setSelectedResource(null)}
                                onEdit={handleEditResource}
                                onFavorite={toggleFavorite}
                                onShare={handleShareResource}
                                categories={categories}
                                theme={theme}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col p-8">
                            {sortedResources.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
                                    {sortedResources.map((resource) => (
                                        <Card
                                            key={resource.id}
                                            onClick={() => isSelectionMode ? toggleSelection(resource.id) : setSelectedResource(resource)}
                                            className={`group relative bg-white dark:bg-[#0f172a] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-none hover:-translate-y-1 overflow-hidden cursor-pointer rounded-[1.75rem] border-none ring-1 ring-slate-200 dark:ring-slate-800 ${selectedResourceIds.has(resource.id)
                                                ? 'ring-2 ring-blue-500 bg-blue-50/10 dark:bg-blue-500/5 shadow-xl shadow-blue-500/20'
                                                : ''
                                                }`}
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent blur-3xl -mr-16 -mt-16 group-hover:from-blue-500/10 transition-colors duration-1000" />

                                            {isSelectionMode && (
                                                <div className="absolute top-6 left-6 z-20">
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedResourceIds.has(resource.id)
                                                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/50'
                                                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700'
                                                        }`}>
                                                        {selectedResourceIds.has(resource.id) && <CheckSquare className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            )}

                                            <CardHeader className="p-6 pb-2 relative">
                                                {activeTab === "Recycle Bin" ? (
                                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRestoreResource(resource.id);
                                                            }}
                                                            className="p-3 bg-white dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-2xl text-emerald-500 shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                                                            title="Restore"
                                                        >
                                                            <RotateCcw className="w-4 h-4 font-black" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setResourceToDelete(resource);
                                                            }}
                                                            className="p-3 bg-white dark:bg-slate-800 hover:bg-red-500 hover:text-white rounded-2xl text-red-500 shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(resource.id);
                                                            }}
                                                            className={`p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95 ${resource.isFavorite ? "text-yellow-500" : "text-slate-400 hover:text-yellow-500"}`}
                                                        >
                                                            <Star className={`w-4 h-4 ${resource.isFavorite ? "fill-yellow-500" : ""}`} />
                                                        </button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xl transition-all active:scale-95"
                                                                >
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 text-slate-900 dark:text-slate-200 shadow-2xl p-2 rounded-2xl">
                                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedResource(resource); }} className="group hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all">
                                                                    <Eye className="w-4 h-4 opacity-50 group-hover:opacity-100" /> View Resource
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditResource(resource); }} className="group hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all">
                                                                    <Pencil className="w-4 h-4 opacity-50 group-hover:opacity-100" /> Edit Metadata
                                                                </DropdownMenuItem>
                                                                <div className="h-px bg-slate-100 dark:bg-slate-800/50 my-1.5 mx-1" />
                                                                <DropdownMenuSub>
                                                                    <DropdownMenuSubTrigger className="hover:bg-blue-600 focus:bg-blue-600 data-[state=open]:bg-blue-600 hover:text-white focus:text-white data-[state=open]:text-white cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors">
                                                                        <Download className="w-4 h-4 opacity-50 group-data-[state=open]:opacity-100 transition-colors" /> Export
                                                                    </DropdownMenuSubTrigger>
                                                                    <DropdownMenuPortal>
                                                                        <DropdownMenuSubContent className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-xl p-2 rounded-2xl min-w-[160px]">
                                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'json'); }} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-bold px-3 py-2.5 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
                                                                                As JSON
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'md'); }} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer text-xs font-bold px-3 py-2.5 rounded-xl transition-colors text-slate-600 dark:text-slate-300">
                                                                                As Markdown
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportResource(resource, 'pdf'); }} className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white cursor-pointer text-xs font-black px-3 py-2.5 rounded-xl transition-colors">
                                                                                As PDF
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuPortal>
                                                                </DropdownMenuSub>
                                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareResource(resource); }} className="group hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all">
                                                                    <Share2 className="w-4 h-4 opacity-50 group-hover:opacity-100" /> Share
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchiveResource(resource.id); }} className="group hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all">
                                                                    <Archive className="w-4 h-4 opacity-50 group-hover:opacity-100" /> {resource.isArchived ? "Unarchive" : "Archive"}
                                                                </DropdownMenuItem>
                                                                <div className="h-px bg-slate-100 dark:bg-slate-800/50 my-1.5 mx-1" />
                                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource); }} className="group hover:bg-red-500 focus:bg-red-500 hover:text-white focus:text-white text-red-500 cursor-pointer gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all">
                                                                    <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" /> Delete Vault Item
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}

                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 ${resource.type === 'Link' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-blue-500/5' :
                                                    resource.type === 'Note' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5' :
                                                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-purple-500/5'
                                                    }`}>
                                                    {resource.type === 'Link' && <LinkIcon className="w-6 h-6" />}
                                                    {resource.type === 'Note' && <FileText className="w-6 h-6" />}
                                                    {resource.type === 'To Do' && <CheckSquare className="w-6 h-6" />}
                                                </div>
                                                <CardTitle className="text-xl font-black text-slate-900 dark:text-white pt-4 line-clamp-1 border-none tracking-tight">{resource.title}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="px-6 pb-4">
                                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">
                                                    {resource.description || resource.content}
                                                </p>
                                            </CardContent>

                                            <CardFooter className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-[#021024]/30 backdrop-blur-sm self-end w-full mt-auto">
                                                <div className="flex gap-2 flex-wrap">
                                                    {(resource.tags?.length ? resource.tags : ['Unsorted']).slice(0, 1).map(tag => {
                                                        const category = categories.find(c => c.name === tag);
                                                        return (
                                                            <Badge
                                                                key={tag}
                                                                className={`border-none rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300 shadow-sm ${!category ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : ''}`}
                                                                style={category ? {
                                                                    backgroundColor: `${category.color}15`,
                                                                    color: category.color,
                                                                    boxShadow: `0 4px 12px ${category.color}10`
                                                                } : undefined}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                                                        {new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-start pt-20">
                                    <div className="max-w-sm w-full text-center space-y-4">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-inner mb-2 transition-colors">
                                            {activeTab === "Links" ? <LinkIcon className="w-8 h-8" /> :
                                                activeTab === "Notes" ? <FileText className="w-8 h-8" /> :
                                                    activeTab === "To Do" ? <CheckSquare className="w-8 h-8" /> :
                                                        activeTab === "Favorites" ? <Star className="w-8 h-8" /> :
                                                            activeTab === "Archive" ? <Archive className="w-8 h-8" /> :
                                                                <Folder className="w-8 h-8" />}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                                                {activeTab === "Recycle Bin" ? "Recycle bin is empty" :
                                                    activeTab === "Archive" ? "Archive is empty" :
                                                        `No ${activeTab.toLowerCase()} yet`}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {activeTab === "Recycle Bin" ? "Items you delete will appear here for 30 days before being permanently removed." :
                                                    activeTab === "All Resources" ? "Start building your collection by adding links, notes, and professional resources." :
                                                        `You haven't added any ${activeTab.toLowerCase()} to your collection yet.`}
                                            </p>
                                            {activeTab !== "Archive" && activeTab !== "Recycle Bin" && (
                                                <Button onClick={() => setIsAddDialogOpen(true)} className="h-11 bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 rounded-xl font-bold text-sm shadow-xl shadow-amber-500/10 group border-none mt-6">
                                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform mr-2" />
                                                    Add Resource
                                                </Button>
                                            )}
                                        </div>
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

                <DeleteResourceDialog
                    isOpen={!!resourceToDelete}
                    onClose={() => setResourceToDelete(null)}
                    onConfirm={confirmDeleteResource}
                    resourceTitle={resourceToDelete?.title}
                />

                <ValidationDialog
                    isOpen={!!validationError}
                    onClose={() => setValidationError(null)}
                    title={validationError?.title}
                    description={validationError?.description || ""}
                />

                <input
                    type="file"
                    ref={importInputRef}
                    onChange={handleFileImport}
                    className="hidden"
                    accept={
                        currentImportType === 'json' ? '.json' :
                            currentImportType === 'md' ? '.md,.markdown' :
                                currentImportType === 'pdf' ? '.pdf' : '*'
                    }
                />

            </main>

            {/* Selection Action Bar */}
            {isSelectionMode && selectedResourceIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2 border-r border-slate-100 dark:border-slate-800 pr-6">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {selectedResourceIds.size} Selected
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-10 rounded-xl gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-bold transition-all">
                                        <Folder className="w-4 h-4" /> Move to
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 w-[200px] p-1.5 shadow-xl">
                                    {categories.map(cat => (
                                        <DropdownMenuItem
                                            key={cat.id}
                                            onClick={() => handleBulkMove(cat.name)}
                                            className="gap-3 rounded-lg py-2.5 cursor-pointer font-medium"
                                        >
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            {cat.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                onClick={handleBulkDelete}
                                className="h-10 rounded-xl gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-all"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsSelectionMode(false);
                                    setSelectedResourceIds(new Set());
                                }}
                                className="h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-all"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
