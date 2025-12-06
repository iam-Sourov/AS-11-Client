import React, { use, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
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
} from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Menu, LogOut, User } from 'lucide-react'; // Icons

const Navbar = () => {
    const { user, LogOut: signOutFunc } = use(AuthContext);
    console.log(user)
    const [isOpen, setIsOpen] = useState(false);

    const getLinkClass = ({ isActive }) =>
        `cursor-pointer hover:text-primary transition ${isActive ? "text-blue-500 font-bold" : "text-sm font-medium"
        }`;

    const handleSignOut = () => {
        signOutFunc()
            .then(() => {
                toast.success("Logged Out Successfully");
                setIsOpen(false);
            })
            .catch((err) => toast.error(err.message));
    };
    const NavItems = () => (
        <>
            <NavLink to="/" className={getLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/books" className={getLinkClass} onClick={() => setIsOpen(false)}>Books</NavLink>
            {user && (
                <NavLink to="/dashboard" className={getLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
            )}
            {!user && (
                <>
                    <NavLink to="/login" className={getLinkClass} onClick={() => setIsOpen(false)}>Login</NavLink>
                    <NavLink to="/register" className={getLinkClass} onClick={() => setIsOpen(false)}>Register</NavLink>
                </>
            )}
        </>
    );

    return (
        <nav className="w-full flex justify-between items-center backdrop-blur-md border-b p-3 sticky top-0 z-50 bg-background/80">
           
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                BookStore
            </Link>

            <div className="hidden md:flex">
                <Menubar className="border-2 rounded-xl flex items-center space-x-6 font-medium px-4 py-2">
                    <MenubarMenu>
                        <MenubarTrigger asChild className="cursor-pointer">
                            <NavLink to="/" className={getLinkClass}>Home</NavLink>
                        </MenubarTrigger>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger asChild className="cursor-pointer">
                            <NavLink to="/books" className={getLinkClass}>Books</NavLink>
                        </MenubarTrigger>
                    </MenubarMenu>

                    {user && (
                        <MenubarMenu>
                            <MenubarTrigger asChild className="cursor-pointer">
                                <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
                            </MenubarTrigger>
                        </MenubarMenu>
                    )}

                    {!user && (
                        <>
                            <MenubarMenu>
                                <MenubarTrigger asChild className="cursor-pointer">
                                    <NavLink to="/login" className={getLinkClass}>Login</NavLink>
                                </MenubarTrigger>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger asChild className="cursor-pointer">
                                    <NavLink to="/register" className={getLinkClass}>Register</NavLink>
                                </MenubarTrigger>
                            </MenubarMenu>
                        </>
                    )}
                </Menubar>
            </div>


            <div className="flex items-center gap-3">

                <AnimatedThemeToggler />

                {user && (
                    <div className="flex items-center gap-3">
                        <Avatar className="cursor-pointer border-2 border-primary/10 hover:border-primary transition">
                            <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                            <AvatarFallback className="font-bold bg-muted">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleSignOut}
                            className="hidden md:flex">
                            Logout
                        </Button>
                    </div>
                )}
                <div className="md:hidden flex items-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-[1.2rem] w-[1.2rem]" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-8">
                                
                                {user && (
                                    <Button variant="destructive" onClick={handleSignOut} className="w-full flex items-center gap-2">
                                        <LogOut size={16} /> Logout
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;