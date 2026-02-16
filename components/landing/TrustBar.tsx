export default function TrustBar() {
    const partners = [
        "Stanford", "MIT", "Harvard", "Oxford", "Berkeley", "Cambridge"
    ];

    return (
        <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Trusted by students from top institutions
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map(p => (
                        <span key={p} className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tighter italic">
                            {p}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
