import { Layout, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface NavbarProps {
    onLogoClick: () => void;
    onSignInClick?: () => void;
    showSignIn?: boolean;
}

export default function Navbar({ onLogoClick, onSignInClick, showSignIn = true }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto w-full">
            <div
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={onLogoClick}
            >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                    <Layout className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tighter text-white">Orbdyn</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
                {showSignIn && onSignInClick && (
                    <Button
                        onClick={onSignInClick}
                        className="bg-slate-900/50 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all shadow-lg shadow-black/20 backdrop-blur-sm"
                    >
                        Sign In
                    </Button>
                )}
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden">
                <DropdownMenu onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
                        {showSignIn && onSignInClick && (
                            <DropdownMenuItem
                                onClick={onSignInClick}
                                className="focus:bg-white/5 focus:text-white py-3"
                            >
                                Sign In
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={onLogoClick}
                            className="focus:bg-white/5 focus:text-white py-3"
                        >
                            Back to Home
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
