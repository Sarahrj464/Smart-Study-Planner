import { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onOpenAuth }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Study Rooms', href: '#rooms' },
        { name: 'Wellness', href: '#wellness' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#2563EB] ${isScrolled
            ? 'py-3 shadow-2xl'
            : 'py-4 shadow-xl'
            }`}>
            {/* Scrolled Glow Effect */}
            {isScrolled && (
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/20 opacity-50" />
            )}

            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-30 text-white">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group">
                    <img
                        src={logo}
                        alt="StudyPulse Logo"
                        className="h-12 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-lg"
                    />
                    <span className="font-heading text-2xl md:text-3xl font-black tracking-tight italic text-white drop-shadow-md">
                        StudyPulse
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className={`hidden lg:flex items-center px-4 py-2 rounded-2xl border border-white/20 bg-white/10 transition-all duration-300`}>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-5 py-2 text-sm font-bold transition-all relative group/link text-white hover:text-blue-50"
                        >
                            {link.name}
                            <span className="absolute bottom-1 left-5 right-5 h-0.5 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-center rounded-full bg-white" />
                        </a>
                    ))}

                </div>

                {/* Auth & Theme (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onOpenAuth('login')}
                            className="text-sm font-bold transition-colors text-white hover:text-blue-100"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => onOpenAuth('signup')}
                            className="px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 bg-white text-[#2563EB] hover:bg-blue-50 hover:scale-105"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="w-px h-6 opacity-20 bg-white" />

                    <ThemeToggle />
                </div>

                {/* Mobile Hamburger & Theme */}
                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />
                    <button
                        className="p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300 overflow-hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            onClick={() => { onOpenAuth('login'); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 text-center font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { onOpenAuth('signup'); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 text-center bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
