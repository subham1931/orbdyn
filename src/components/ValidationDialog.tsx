import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ValidationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description: string;
}

export default function ValidationDialog({ isOpen, onClose, title = "Validation Error", description }: ValidationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 sm:max-w-[400px] p-0 overflow-hidden gap-0 transition-colors">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>

                    <DialogHeader className="p-0">
                        <DialogTitle className="text-xl font-black text-center tracking-tight">{title}</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-center text-sm pt-2 leading-relaxed font-medium">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                    <Button
                        onClick={onClose}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Understood
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
