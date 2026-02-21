import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const TrustBar = () => {
    const partners = [
        "Stanford", "MIT", "Harvard", "Oxford", "Berkeley", "Cambridge"
    ];

    return (
        <section className="py-12 border-y border-white/10 bg-[#2563EB]">
            <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
                <p className="text-sm font-bold text-blue-100 uppercase tracking-[0.3em]">
                    Trusted by students from top institutions
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {partners.map(p => (
                        <motion.span
                            key={p}
                            whileHover={{ scale: 1.15, opacity: 1, filter: "brightness(200%)" }}
                            className="text-2xl font-black text-white tracking-tighter italic opacity-60 transition-all duration-300 cursor-default"
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
