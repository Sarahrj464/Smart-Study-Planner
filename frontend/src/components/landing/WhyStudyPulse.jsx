import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WhyStudyPulse = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <section ref={sectionRef} id="rooms" className="py-24 px-8 md:px-20 bg-slate-50/30 dark:bg-slate-900/20 overflow-hidden text-left relative">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-2 lg:order-1"
                    >
                        <motion.div
                            style={{ y }}
                            className="absolute -left-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
                        />
                        <div className="relative grid grid-cols-2 gap-4">
                            {[
                                { label: "Focus Rate", value: "98%", color: "bg-blue-500" },
                                { label: "Retention", value: "+40%", color: "bg-purple-500" },
                                { label: "Time Saved", value: "12h/wk", color: "bg-emerald-500" },
                                { label: "Grades", value: "A+", color: "bg-orange-500" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.08, y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                    className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-2 translate-y-[20px] even:translate-y-0 transition-all duration-300 cursor-default"
                                >
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black tracking-tighter dark:text-white">{stat.value}</p>
                                    <div className={`h-1.5 w-10 rounded-full ${stat.color}`} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <ScrollReveal direction="right">
                            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">The Intelligent Choice</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white leading-tight">
                                Built for the way students work today.
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                Modern studying requires more than just folders and flashcards. StudyPulse integrates with your university life to provide a seamless, adaptive experience.
                            </p>
                        </ScrollReveal>

                        <motion.ul
                            variants={listVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-5"
                        >
                            {[
                                "Automated scheduling based on syllabus upload",
                                "Cross-device synchronization for mobile & tablet",
                                "Deep-focus modes that block social distractions",
                                "Peer-to-peer accountability in live study sessions"
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={listItemVariants}
                                    whileHover={{ x: 10, scale: 1.02 }}
                                    className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer group/item"
                                >
                                    <CheckCircle2 size={24} className="text-blue-500 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item}</span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <ScrollReveal direction="up" delay={0.4}>
                            <button className="flex items-center gap-2 font-black text-blue-600 uppercase tracking-widest text-xs hover:gap-4 transition-all group">
                                See the analytics dashboard <ArrowRight size={18} />
                            </button>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyStudyPulse;
