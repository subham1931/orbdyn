import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteResourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    resourceTitle?: string;
}

export default function DeleteResourceDialog({ isOpen, onClose, onConfirm, resourceTitle }: DeleteResourceDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 sm:max-w-[400px] p-0 overflow-hidden gap-0 transition-colors">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <Trash2 className="w-6 h-6 text-red-500" />
                    </div>

                    <DialogHeader className="p-0">
                        <DialogTitle className="text-xl font-bold text-center">Delete Resource?</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-center text-sm pt-2">
                            Are you sure you want to delete <span className="text-slate-900 dark:text-white font-bold">{resourceTitle || "this resource"}</span>?
                            This action cannot be undone and will permanently remove it from your collection.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 gap-3 sm:justify-between transition-colors">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
