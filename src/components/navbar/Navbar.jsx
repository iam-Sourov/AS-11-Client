import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { BookOpen, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, LogOut } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const getLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary font-bold" : "text-muted-foreground"
        }`;

    const handleSignOut = () => {
        LogOut()
            .then(() => {
                toast.success("Logged Out Successfully");
                setIsOpen(false);
            })
            .catch((err) => toast.error(err.message));
    };

    return (
        <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span>BookLibrary</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={getLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/all-books" className={getLinkClass}>
                        All Books
                    </NavLink>
                    {user && (
                        <NavLink to="/dashboard" className={getLinkClass}>
                            Dashboard
                        </NavLink>
                    )}
                    {!user && (
                        <div className="flex items-center gap-4">
                            <NavLink to="/login" className={getLinkClass}>
                                Login
                            </NavLink>
                            <NavLink to="/register" className={getLinkClass}>
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <AnimatedThemeToggler />
                    {user && (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to={'/dashboard/my-profile'}>
                                <Avatar className="cursor-pointer border-2 border-primary/10 hover:border-primary transition h-9 w-9">
                                    <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                                    <AvatarFallback className="font-bold bg-muted">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleSignOut}
                                className="h-9">
                                Logout
                            </Button>
                        </div>
                    )}
                    <div className="md:hidden flex items-center">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle className="text-left flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" /> BookLibrary
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 mt-8">
                                    <NavLink to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                                        Home
                                    </NavLink>
                                    <NavLink to="/all-books" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                                        All Books
                                    </NavLink>
                                    {user && (
                                        <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                                            Dashboard
                                        </NavLink>
                                    )}

                                    {!user && (
                                        <>
                                            <NavLink to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                                                Login
                                            </NavLink>
                                            <NavLink to="/register" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                                                Register
                                            </NavLink>
                                        </>
                                    )}
                                    {user && (
                                        <Button
                                            variant="destructive"
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 mt-4">
                                            Logout
                                        </Button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;