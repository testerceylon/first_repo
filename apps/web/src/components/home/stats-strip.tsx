export function StatsStrip() {
  const stats = [
    { value: "55K+", label: "Subscribers" },
    { value: "6+", label: "Years Active" },
    { value: "CoD Mobile", label: "Community" },
    { value: "Weekly", label: "New Videos" },
  ];

  return (
    <section className="bg-[#111111] border-y border-[#1e1e1e]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-[#1e1e1e]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center gap-1 py-2 md:px-6"
            >
              <span className="font-heading font-bold text-3xl md:text-4xl neon-text leading-none">
                {stat.value}
              </span>
              <span className="font-body text-sm text-[#666] uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
