import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Spinner } from "@/components/ui/spinner"
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
import { Menu, LogOut } from 'lucide-react'; // Icons

const Navbar = () => {
    const { user, LogOut } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const getLinkClass = ({ isActive }) =>
        `cursor-pointer hover:text-primary transition ${isActive ? "text-blue-500 font-bold" : "text-sm font-medium"
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
        <nav className=" w-full flex justify-between items-center backdrop-blur-md border-b p-3 sticky top-0 z-50 bg-background/80">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                BookCourier
            </Link>
            <div className="hidden md:flex justify-center items-center">
                <Menubar className="border-2 rounded-xl flex justify-center items-center space-x-6 font-medium ">
                    <MenubarMenu>
                        <MenubarTrigger asChild className="cursor-pointer">
                            <NavLink to="/" className={getLinkClass}>Home</NavLink>
                        </MenubarTrigger>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger asChild className="cursor-pointer">
                            <NavLink to="/all-books" className={getLinkClass}>All-Books</NavLink>
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
                        <Link to={'/dashboard/my-profile'}>
                            <Avatar className="cursor-pointer border-2 border-primary/10 hover:border-primary transition">
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
                        <SheetContent side="right" className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-8">
                                <NavLink to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                    Home
                                </NavLink>
                                <NavLink to="/all-books" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                    AllBooks
                                </NavLink>
                                {user && (
                                    <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                        Dashboard
                                    </NavLink>
                                )}
                                {!user && (
                                    <>
                                        <NavLink to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                            Login
                                        </NavLink>
                                        <NavLink to="/register" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                                            Register
                                        </NavLink>
                                    </>
                                )}
                                {user && (
                                    <Button
                                        variant="destructive"
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-2">
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