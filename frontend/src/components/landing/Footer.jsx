import { Github, Twitter, Linkedin, Facebook, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
    const socialLinks = [
        { Icon: Github, href: "https://github.com/studypulse", name: "GitHub" },
        { Icon: Twitter, href: "https://twitter.com/studypulse", name: "Twitter" },
        { Icon: Linkedin, href: "https://linkedin.com/company/studypulse", name: "LinkedIn" },
        { Icon: Facebook, href: "https://facebook.com/studypulse", name: "Facebook" }
    ];

    const footerGroups = [
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
            links: ["Documentation", "Community", "Support"]
        },
        {
            title: "Legal",
            links: ["Privacy", "Terms", "Cookie Policy", "Security"]
        }
    ];

    return (
        <footer className="pt-24 pb-12 px-6 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-30" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-24 -left-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
                    <div className="col-span-2 space-y-8 text-left">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="StudyPulse Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-2xl font-black tracking-tighter uppercase italic">StudyPulse</span>
                        </Link>
                        <p className="text-base text-slate-400 leading-relaxed max-w-xs font-medium">
                            Empowering students with intelligent productivity tools and wellness tracking for a better academic life.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map(({ Icon, href, name }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>

                        {/* App Store Links */}
                        <div className="pt-6 space-y-4">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">Get the App</h5>
                            <div className="flex flex-wrap gap-4">
                                <a href="https://apps.apple.com/app/studypulse" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all group">
                                    <svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor" className="text-slate-400 group-hover:text-white transition-colors"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-39-19.9-54.7-46-54.7-83.9z" /></svg>
                                    <div className="text-left">
                                        <p className="text-[9px] leading-none text-slate-500 uppercase tracking-wider font-bold">Download on</p>
                                        <p className="font-bold leading-none text-sm text-slate-300 group-hover:text-white mt-1">Apple Store</p>
                                    </div>
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.studypulse" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all group">
                                    <svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor" className="text-slate-400 group-hover:text-white transition-colors"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                    <div className="text-left">
                                        <p className="text-[9px] leading-none text-slate-500 uppercase tracking-wider font-bold">Get it on</p>
                                        <p className="font-bold leading-none text-sm text-slate-300 group-hover:text-white mt-1">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {footerGroups.map((group, i) => (
                        <div key={i} className="space-y-6 text-left">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">{group.title}</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-bold">
                                {group.links.map((link, li) => (
                                    <li key={li}>
                                        <a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-tight">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <span>© 2026 StudyPulse. All rights reserved.</span>
                        <span className="hidden md:inline text-slate-800">|</span>
                        <span className="flex items-center gap-1">Made with <Heart size={10} className="text-blue-600 fill-blue-600" /> for students</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
