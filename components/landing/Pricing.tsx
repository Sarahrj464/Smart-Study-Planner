import { Check } from "lucide-react";

export default function Pricing() {
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

    return (
        <section id="pricing" className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Pricing</h2>
                    <h3 className="text-4xl font-bold tracking-tight">Flexible plans for every student.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((t, i) => (
                        <div
                            key={i}
                            className={`p-10 rounded-3xl bg-white dark:bg-slate-900 border ${t.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 relative" : "border-slate-100 dark:border-slate-800"
                                }`}
                        >
                            {t.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                                    Most Popular
                                </span>
                            )}
                            <div className="space-y-4 mb-8">
                                <h4 className="text-xl font-bold">{t.name}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold tracking-tight">{t.price}</span>
                                    <span className="text-slate-500 text-sm">/month</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">{t.description}</p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {t.features.map((f, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-sm font-medium">
                                        <Check size={18} className="text-blue-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${t.popular ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20" : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}>
                                Choose {t.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
