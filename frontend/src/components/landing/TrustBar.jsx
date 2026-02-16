import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const TrustBar = () => {
    const partners = [
        "Stanford", "MIT", "Harvard", "Oxford", "Berkeley", "Cambridge"
    ];

    return (
        <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10">
            <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
                    Trusted by students from top institutions
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {partners.map(p => (
                        <motion.span
                            key={p}
                            whileHover={{ scale: 1.15, opacity: 1, filter: "grayscale(0%)" }}
                            className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tighter italic opacity-40 grayscale transition-all duration-300 cursor-default"
                        >
                            {p}
                        </motion.span>
                    ))}
                </div>
            </ScrollReveal>
        </section>
    );
}

export default TrustBar;
