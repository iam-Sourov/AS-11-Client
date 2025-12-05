import React from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button";



const Navbar = () => {

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `hover:text-primary transition ${isActive ? 'text-blue-500 text-lg font-semibold' : 'text-sm'}`}>
                Home
            </NavLink>
            <NavLink
                to="/addTransaction"
                className={({ isActive }) =>
                    `hover:text-primary transition ${isActive ? 'text-blue-500 text-lg font-semibold' : 'text-sm'}`}>
                Add Transaction
            </NavLink>
            <NavLink
                to="/myTransaction"
                className={({ isActive }) =>
                    `hover:text-primary transition ${isActive ? 'text-blue-500 text-lg font-semibold' : 'text-sm'}`}>
                My Transactions
            </NavLink>
            <NavLink
                to="/reports"
                className={({ isActive }) =>
                    `hover:text-primary transition ${isActive ? 'text-blue-500 text-lg font-semibold' : 'text-sm'}`}>
                Reports
            </NavLink>
        </>
    );

    return (
        <div className="w-full flex justify-between items-center bg-white/20 backdrop-blur-md border p-3">
            <div>
                <Link to="/" className="text-xl font-bold">Fin-EASE</Link>
            </div>
            <div className="hidden md:flex items-center space-x-6 font-medium">
                {navLinks}
            </div>

            <div className="hidden md:flex items-center gap-3">
                <AnimatedThemeToggler />
                
            </div>

            <div className="md:hidden flex items-center space-x-2">
                
            </div>
        </div>
    );
};

export default Navbar;
