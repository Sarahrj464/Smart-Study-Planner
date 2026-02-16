export default function StatsRow() {
    const stats = [
        { label: "Total Sessions", value: "2.4M+" },
        { label: "Better Grades", value: "94%" },
        { label: "Top Universities", value: "120+" }
    ];

    return (
        <section className="py-20 bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {stats.map((s, i) => (
                    <div key={i} className="space-y-4">
                        <h3 className="text-5xl md:text-6xl font-black tracking-tighter">{s.value}</h3>
                        <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
