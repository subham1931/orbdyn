import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types";
import { Check } from "lucide-react";

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: Omit<Category, "id">) => void;
    categoryToEdit?: Category | null;
}

const COLORS = [
    { name: "orange", value: "#f97316", border: "border-orange-500" },
    { name: "red", value: "#ef4444", border: "border-red-500" },
    { name: "green", value: "#22c55e", border: "border-green-500" },
    { name: "blue", value: "#3b82f6", border: "border-blue-500" },
    { name: "purple", value: "#a855f7", border: "border-purple-500" },
    { name: "pink", value: "#ec4899", border: "border-pink-500" },
    { name: "cyan", value: "#06b6d4", border: "border-cyan-500" },
    { name: "yellow", value: "#eab308", border: "border-yellow-500" },
];

export default function CategoryDialog({ isOpen, onClose, onSave, categoryToEdit }: CategoryDialogProps) {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [prevCategory, setPrevCategory] = useState(categoryToEdit);

    if (isOpen !== prevIsOpen || categoryToEdit !== prevCategory) {
        setPrevIsOpen(isOpen);
        setPrevCategory(categoryToEdit);
        if (isOpen) {
            setName(categoryToEdit?.name ?? "");
            setSelectedColor(categoryToEdit?.color ?? COLORS[0].value);
        }
    }

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSave({
            name: name.trim(),
            color: selectedColor
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0f172a] border border-slate-800/60 text-slate-200 sm:max-w-[425px] p-0 overflow-hidden gap-0 rounded-2xl shadow-2xl shadow-black/50">
                {/* Header with subtle gradient border */}
                <div className="bg-[#0f172a] p-6 pb-4 border-b border-slate-800/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            {categoryToEdit ? "Edit Category" : "New Category"}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-8 bg-[#0f172a]">
                    <div className="space-y-3 group">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Category Name
                        </label>
                        <div className="relative">
                            <Input
                                placeholder="e.g., Work, Personal, Ideas"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#1e293b]/30 border-slate-800 h-12 pl-4 rounded-xl focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b]/50 transition-all font-medium text-slate-200 placeholder:text-slate-600"
                            />
                            {/* Ambient glow on input focus */}
                            <div className="absolute inset-0 rounded-xl bg-[#f59e0b]/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Theme Color
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`
                                        group relative w-full aspect-square rounded-xl transition-all duration-300 flex items-center justify-center
                                        ${selectedColor === color.value
                                            ? "ring-2 ring-white shadow-lg shadow-black/50 scale-100"
                                            : "hover:scale-105 hover:ring-1 hover:ring-slate-700 opacity-80 hover:opacity-100"
                                        }
                                    `}
                                    style={{
                                        backgroundColor: color.value,
                                        boxShadow: selectedColor === color.value ? `0 0 20px ${color.value}40` : 'none'
                                    }}
                                >
                                    {selectedColor === color.value && (
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 animate-in zoom-in duration-200">
                                            <Check className="w-4 h-4 text-white font-bold stroke-[3]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-2 pb-6 bg-[#0f172a] border-t border-slate-800/50 flex items-center justify-end gap-3 z-10">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-11 px-6 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className={`
                            h-11 px-8 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 text-black
                            ${!name.trim()
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-[#f59e0b] hover:bg-[#d97706] hover:shadow-amber-500/25"
                            }
                        `}
                    >
                        {categoryToEdit ? "Save Changes" : "Create Category"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
