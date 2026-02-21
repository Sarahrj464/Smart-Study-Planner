import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-28 right-8 z-[60]">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group neon-glow-primary sm:flex hidden"
                    aria-label="Back to Top"
                >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 font-bold whitespace-nowrap text-sm">
                        Back to Top
                    </span>
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
