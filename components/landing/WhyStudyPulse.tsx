import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function WhyStudyPulse() {
    return (
        <section id="solutions" className="py-24 px-6 bg-slate-50/30 dark:bg-slate-900/20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="relative grid grid-cols-2 gap-4">
                            {[
                                { label: "Focus Rate", value: "98%", color: "bg-blue-500" },
                                { label: "Retention", value: "+40%", color: "bg-purple-500" },
                                { label: "Time Saved", value: "12h/wk", color: "bg-emerald-500" },
                                { label: "Grades", value: "A+", color: "bg-orange-500" },
                            ].map((stat, i) => (
                                <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-2 translate-y-[20px] even:translate-y-0">
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                                    <div className={`h-1 w-10 rounded-full ${stat.color}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">The Intelligent Choice</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Built for the way students work today.
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Modern studying requires more than just folders and flashcards. StudyPulse integrates with your university life to provide a seamless, adaptive experience.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Automated scheduling based on syllabus upload",
                                "Cross-device synchronization for mobile & tablet",
                                "Deep-focus modes that block social distractions",
                                "Peer-to-peer accountability in live study sessions"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 size={20} className="text-blue-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="flex items-center gap-2 font-bold text-blue-600 hover:gap-4 transition-all group">
                            See the analytics dashboard <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
