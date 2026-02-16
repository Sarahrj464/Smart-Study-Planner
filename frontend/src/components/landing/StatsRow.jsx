import { motion } from "framer-motion";

const StatsRow = () => {
    const stats = [
        { label: "Total Sessions", value: "2.4M+" },
        { label: "Better Grades", value: "94%" },
        { label: "Top Universities", value: "120+" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring" } }
    };

    return (
        <section className="py-20 bg-blue-600 text-white overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
            >
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="space-y-4 cursor-default p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
                    >
                        <h3 className="text-5xl md:text-7xl font-black tracking-tighter">{s.value}</h3>
                        <p className="text-blue-100 font-bold uppercase tracking-[0.3em] text-xs">{s.label}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export default StatsRow;
