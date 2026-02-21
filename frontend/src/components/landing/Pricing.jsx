import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const Pricing = ({ onOpenAuth }) => {
    const tiers = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for casual learners.",
            features: ["Up to 3 study rooms", "Basic focus timer", "5 syllabus uploads", "Standard support"]
        },
        {
            name: "Pro",
            price: "$9",
            popular: true,
            description: "Everything you need to excel.",
            features: ["Unlimited study rooms", "Advanced AI diagnostics", "Unlimited syllabus uploads", "Priority support", "Personalized insights"]
        },
        {
            name: "Team",
            price: "$29",
            description: "Collaborative tools for clubs.",
            features: ["Custom study groups", "Bulk uploads", "Admin dashboard", "Integrations API", "24/7 dedicated support"]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="pricing" className="py-24 px-8 md:px-20 bg-slate-50/50 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Pricing</h2>
                    <h3 className="text-4xl font-bold tracking-tight dark:text-white">Flexible plans for every student.</h3>
                </ScrollReveal>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {tiers.map((t, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{
                                y: -15,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            className={`p-10 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 cursor-default shadow-sm hover:shadow-2xl hover:border-blue-500/50 ${t.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 relative" : "border-slate-100 dark:border-slate-800"
                                }`}
                        >
                            {t.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                                    Most Popular
                                </span>
                            )}
                            <div className="space-y-4 mb-8 text-left">
                                <h4 className="text-xl font-bold dark:text-white">{t.name}</h4>
                                <div className="flex items-baseline gap-1 dark:text-white">
                                    <span className="text-4xl font-extrabold tracking-tight">{t.price}</span>
                                    <span className="text-slate-500 text-sm">/month</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">{t.description}</p>
                            </div>

                            <ul className="space-y-4 mb-10 text-left">
                                {t.features.map((f, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-medium dark:text-slate-300">
                                        <Check size={18} className="text-blue-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => onOpenAuth('signup')}
                                className={`w-full py-4 rounded-2xl font-bold transition-all ${t.popular ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20" : "bg-slate-50 dark:bg-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                    }`}
                            >
                                Choose {t.name}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Pricing;
