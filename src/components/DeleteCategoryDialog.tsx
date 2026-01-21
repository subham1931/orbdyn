import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName?: string;
}

export default function DeleteCategoryDialog({ isOpen, onClose, onConfirm, categoryName }: DeleteCategoryDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0b1120] border-slate-800 text-slate-200 sm:max-w-[400px] p-0 overflow-hidden gap-0">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>

                    <DialogHeader className="p-0">
                        <DialogTitle className="text-xl font-bold text-center">Delete Category?</DialogTitle>
                        <DialogDescription className="text-slate-400 text-center text-sm pt-2">
                            Are you sure you want to delete <span className="text-white font-medium">{categoryName || "this category"}</span>?
                            This action cannot be undone and will remove the category from your filter list.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="p-5 bg-slate-900/50 border-t border-slate-800/50 gap-3 sm:justify-between">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
