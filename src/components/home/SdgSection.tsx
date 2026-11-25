import { Briefcase, Scale, Handshake } from "lucide-react";

export const SDGS = [
  { n: 8, title: "Decent Work and Economic Growth", icon: Briefcase, color: "bg-sdg8", text: "We open doors to internships, training and entrepreneurship programs that build employable skills and real work experience." },
  { n: 10, title: "Reduced Inequalities", icon: Scale, color: "bg-sdg10", text: "Free access, mobile-first design and listings across counties mean opportunity no longer depends on who you know or where you live." },
  { n: 17, title: "Partnerships for the Goals", icon: Handshake, color: "bg-sdg17", text: "We connect universities, NGOs, companies and training institutions with young people in one shared, trusted space." },
];

export function SdgSection({ heading = true }: { heading?: boolean }) {
  return (
    <section className="py-20">
      <div className="container-page">
        {heading && (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">Our impact</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Built for the Sustainable Development Goals</h2>
            <p className="mt-3 text-muted-foreground">OpportunityHub contributes directly to three UN SDGs.</p>
          </div>
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SDGS.map((s) => (
            <div key={s.n} className="card-hover overflow-hidden rounded-2xl border bg-card shadow-card">
              <div className={`${s.color} flex items-center justify-between px-6 py-5 text-navy-foreground`}>
                <span className="font-display text-4xl font-extrabold">SDG {s.n}</span>
                <s.icon className="size-8 opacity-90" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
