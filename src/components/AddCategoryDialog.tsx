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
            <DialogContent className="bg-[#0b1120] border-slate-800 text-slate-200 sm:max-w-[400px] p-0 overflow-hidden gap-0">
                <DialogHeader className="p-5 border-b border-slate-800/50">
                    <DialogTitle className="text-lg font-bold">
                        {categoryToEdit ? "Edit Category" : "New Category"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-5 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Name
                        </label>
                        <Input
                            placeholder="e.g., Work, Personal, Ideas"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-[#1e293b]/50 border-slate-700 focus:border-blue-500 text-slate-200 h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center relative ${selectedColor === color.value
                                        ? "ring-2 ring-offset-2 ring-offset-[#0b1120] ring-white scale-110"
                                        : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                >
                                    {selectedColor === color.value && (
                                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 pt-2 flex justify-between gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="flex-[2] h-11 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {categoryToEdit ? "Save Changes" : "Create Category"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
