import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FinalCTA = ({ onOpenAuth }) => {
    return (
        <section className="py-24 px-6 bg-white dark:bg-slate-950 overflow-hidden">
            <ScrollReveal direction="up" distance={60}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto px-10 md:px-20 py-16 md:py-24 bg-slate-900 dark:bg-blue-600 rounded-[3rem] text-center text-white space-y-10 relative overflow-hidden shadow-2xl cursor-default"
                >
                    {/* Abstract shapes */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [0, -90, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20"
                    />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Ready to master your rhythm?</h3>
                        <p className="text-blue-100/70 text-lg md:text-xl font-medium">
                            Join 50,000+ students already using StudyPulse to achieve their academic goals.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="w-full sm:w-auto min-w-[300px]">
                            <input
                                type="email"
                                placeholder="Enter your student email"
                                className="w-full px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-100/50 outline-none focus:bg-white/20 transition-all text-center sm:text-left font-bold"
                            />
                        </div>
                        <button
                            onClick={() => onOpenAuth('signup')}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 dark:text-blue-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-xl"
                        >
                            Start Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </ScrollReveal>
        </section>
    );
}

export default FinalCTA;
