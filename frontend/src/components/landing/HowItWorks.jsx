import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const HowItWorks = () => {
    const steps = [
        {
            no: "01",
            title: "Upload Syllabus",
            desc: "Upload a PDF syllabus and our AI will automatically parse all your dates, tasks, and topics."
        },
        {
            no: "02",
            title: "Generate Plan",
            desc: "Receive a personalized study plan that adapts to your learning speed and energy levels."
        },
        {
            no: "03",
            title: "Track Progress",
            desc: "Use our built-in tools to study, earn rewards, and watch your academic performance climb."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="wellness" className="py-24 px-6 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Process</h2>
                    <h3 className="text-4xl font-black tracking-tighter dark:text-white">Your path to A+ in seconds.</h3>
                </ScrollReveal>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-16 relative"
                >
                    {/* Horizontal Line connector (Desktop only) */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-100 dark:bg-slate-800 origin-left"
                    />

                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="relative flex flex-col items-center text-center space-y-6 group cursor-default"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 z-10 group-hover:bg-blue-700 transition-colors"
                            >
                                {s.no}
                            </motion.div>
                            <h4 className="text-xl font-bold dark:text-white group-hover:text-blue-600 transition-colors">{s.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                                {s.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default HowItWorks;
