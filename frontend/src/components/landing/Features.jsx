import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import {
    Zap,
    ShieldCheck,
    Target,
    Layout,
    BarChart3,
    MessageSquare
} from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: <Zap className="text-blue-500" />,
            title: "Real-time Sync",
            description: "Everything you do is synced across all your devices instantly. Study from anywhere."
        },
        {
            icon: <Target className="text-purple-500" />,
            title: "Smart Focus",
            description: "Integrated Pomodoro timer with adaptive breaks to maximize your brain power."
        },
        {
            icon: <ShieldCheck className="text-emerald-500" />,
            title: "Private Rooms",
            description: "Join encrypted study rooms with your classmates for shared accountability."
        },
        {
            icon: <BarChart3 className="text-orange-500" />,
            title: "Visual Analytics",
            description: "Understand your study patterns with beautiful, deeply insightful charts and graphs."
        },
        {
            icon: <Layout className="text-cyan-500" />,
            title: "Interactive Timetable",
            description: "Manage your complex schedule with a drag-and-drop builder designed for students."
        },
        {
            icon: <MessageSquare className="text-pink-500" />,
            title: "Collaboration",
            description: "Share notes, tasks, and goals in a seamless, distraction-free environment."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section id="features" className="py-24 px-8 md:px-20 bg-white dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="left" className="max-w-xl mb-16">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 dark:text-white">
                        Everything you need for academic excellence.
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        StudyPulse combines best-in-class productivity tools into one cohesive, beautiful interface.
                    </p>
                </ScrollReveal>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 group text-left relative overflow-hidden"
                        >
                            {/* Card Accent Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all duration-300 group-hover:rotate-12">
                                    <div className="text-blue-500 dark:text-blue-400 transition-colors duration-300 transform group-hover:scale-110">
                                        {f.icon}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black tracking-tight dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {f.title}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
                                        {f.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Features;
