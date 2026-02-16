export default function HowItWorks() {
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

    return (
        <section className="py-24 px-6 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Process</h2>
                    <h3 className="text-4xl font-bold tracking-tight">Your path to A+ in seconds.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    {/* Horizontal Line connector (Desktop only) */}
                    <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-100 dark:bg-slate-800" />

                    {steps.map((s, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center space-y-6">
                            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 z-10 transition-transform hover:scale-110">
                                {s.no}
                            </div>
                            <h4 className="text-xl font-bold">{s.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
