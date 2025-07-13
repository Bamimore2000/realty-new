export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-background text-center text-foreground">
      <h2 className="text-2xl font-bold mb-10">
        Why Choose <span className="text-primary">Core Key Realty?</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {[
          {
            title: "Hyper-Local Expertise",
            icon: "🧭",
            desc: "Deep knowledge of your neighborhood and market trends.",
          },
          {
            title: "Elite Agents",
            icon: "💼",
            desc: "Professional, responsive, and client-first licensed experts.",
          },
          {
            title: "Smooth Closings",
            icon: "📝",
            desc: "We handle contracts, compliance, and timelines — stress-free.",
          },
          {
            title: "Exclusive Listings",
            icon: "🏘️",
            desc: "Access to hidden gems and premium properties you won’t find elsewhere.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition border border-border"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
