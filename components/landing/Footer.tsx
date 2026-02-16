import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
    const links = [
        {
            title: "Product",
            links: ["Features", "Pricing", "Updates", "Beta Program"]
        },
        {
            title: "Company",
            links: ["About Us", "Careers", "Press", "Contact"]
        },
        {
            title: "Resources",
            links: ["Blog", "Documentation", "Community", "Support"]
        },
        {
            title: "Legal",
            links: ["Privacy", "Terms", "Cookie Policy", "Security"]
        }
    ];

    return (
        <footer className="pt-24 pb-12 px-6 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
                    <div className="col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <span className="font-bold">S</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">StudyPulse</span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            Empowering students with intelligent productivity tools and wellness tracking for a better academic life.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <Link key={i} href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {links.map((group, i) => (
                        <div key={i} className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider">{group.title}</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                                {group.links.map((link, li) => (
                                    <li key={li}>
                                        <Link href="#" className="hover:text-blue-600 transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
                    <p>© 2026 StudyPulse. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
                        <Link href="#" className="hover:text-blue-600">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
