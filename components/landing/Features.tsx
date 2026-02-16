import {
    Zap,
    ShieldCheck,
    Target,
    Layout,
    BarChart3,
    MessageSquare
} from "lucide-react";

export default function Features() {
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

    return (
        <section id="features" className="py-24 px-6 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-xl mb-16">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        Everything you need for academic excellence.
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        StudyPulse combines best-in-class productivity tools into one cohesive, beautiful interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="space-y-4 group">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-bold">{f.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
