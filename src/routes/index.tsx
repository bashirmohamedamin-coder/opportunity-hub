import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Search, UserPlus, SearchCheck, Send, Users, Building2, Sparkles, Quote, Briefcase, MapPin, CalendarClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, OPP_SELECT, type Opportunity } from "@/lib/opportunities";
import { OpportunityCard, OpportunityCardSkeleton } from "@/components/site/OpportunityCard";
import { OrgLogo } from "@/components/site/OrgLogo";
import { SdgSection } from "@/components/home/SdgSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpportunityHub – Discover Opportunities. Build Your Future." },
      { name: "description", content: "Find internships, scholarships, volunteer roles and training programs for young people in Kenya and East Africa." },
      { property: "og:title", content: "OpportunityHub – Your Future Starts With the Right Opportunity" },
      { property: "og:description", content: "The youth opportunities platform for Kenya and East Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const featured = useQuery({
    queryKey: ["opps", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select(OPP_SELECT).eq("status", "published").gte("deadline", new Date().toISOString().slice(0, 10)).order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data as Opportunity[];
    },
  });
  const counts = useQuery({
    queryKey: ["opps", "counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("category").eq("status", "published");
      if (error) throw error;
      return data.reduce<Record<string, number>>((a, r) => ({ ...a, [r.category]: (a[r.category] ?? 0) + 1 }), {});
    },
  });
  const partners = useQuery({
    queryKey: ["orgs", "partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*").order("created_at").limit(8);
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-navy-foreground">
        <div className="grid-dots absolute inset-0" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div>
            <Badge className="border-navy-foreground/20 bg-navy-foreground/10 text-navy-foreground hover:bg-navy-foreground/10"><Sparkles className="size-3.5" /> Kenya & East Africa</Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              Your Future Starts With the <span className="text-brand">Right Opportunity.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-foreground/75">
              OpportunityHub brings internships, scholarships, volunteer roles and training programs into one place — so every young person can learn, grow and get hired.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/opportunities", search: q.trim() ? { q: q.trim() } : {} }); }}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-card p-2 shadow-lift"
              role="search"
            >
              <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search internships, scholarships, skills…" aria-label="Search opportunities"
                className="min-w-0 flex-1 bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground" />
              <Button type="submit" variant="brand" size="lg">Search</Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild><Link to="/opportunities">Explore Opportunities <ArrowRight /></Link></Button>
              <Button variant="heroOutline" size="xl" asChild><Link to="/auth" search={{ mode: "signup" }}>Join OpportunityHub</Link></Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container-page">
          <SectionHead eyebrow="Browse by category" title="Find the path that fits you" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.value} to="/opportunities" search={{ category: c.value }} className="card-hover group rounded-2xl border bg-card p-6 shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground"><c.icon className="size-6" /></span>
                <h3 className="mt-4 font-semibold">{c.plural}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                <p className="mt-4 text-sm font-semibold text-primary">{counts.data?.[c.value] ?? 0} open listings →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-secondary/60 py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Featured" title="Latest opportunities" align="left" />
            <Button variant="outline" asChild><Link to="/opportunities">View all <ArrowRight /></Link></Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.isLoading && Array.from({ length: 6 }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
            {featured.error && <p className="text-destructive">Couldn't load opportunities. Please refresh.</p>}
            {featured.data?.map((o) => <OpportunityCard key={o.id} o={o} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container-page">
          <SectionHead eyebrow="How it works" title="Three steps to your next opportunity" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: UserPlus, t: "Create your profile", d: "Sign up free as a student, graduate, young professional or organization." },
              { icon: SearchCheck, t: "Discover & save", d: "Search and filter by category, county and work mode. Bookmark what interests you." },
              { icon: Send, t: "Apply & track", d: "Apply directly or through the organization's link and track every application in your dashboard." },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border bg-card p-7 shadow-card">
                <span className="absolute -top-4 left-7 grid size-8 place-items-center rounded-full bg-navy font-display text-sm font-bold text-navy-foreground">{i + 1}</span>
                <s.icon className="size-8 text-brand" />
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-16 text-navy-foreground">
        <div className="container-page">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "12,500+", l: "Registered users", icon: Users },
              { v: "850+", l: "Listed opportunities", icon: Briefcase },
              { v: "120+", l: "Partner organizations", icon: Building2 },
              { v: "3,400+", l: "Successful connections", icon: Sparkles },
            ].map((s) => (
              <div key={s.l}>
                <s.icon className="mx-auto size-6 text-brand" />
                <p className="mt-2 font-display text-4xl font-extrabold">{s.v}</p>
                <p className="text-sm text-navy-foreground/70">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-navy-foreground/50">Demo figures for illustration — real platform statistics will replace these once available.</p>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container-page">
          <SectionHead eyebrow="Partners" title="Organizations on OpportunityHub" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {partners.data?.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-card">
                <OrgLogo name={p.name} url={p.logo_url} />
                <p className="text-sm font-medium leading-tight">{p.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">Organizations labelled "(Demo)" are fictional examples.</p>
        </div>
      </section>

      <div className="bg-secondary/60"><SdgSection /></div>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-page">
          <SectionHead eyebrow="Sample stories" title="What young people could say" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "Amina W.", r: "Computer Science graduate, Nairobi", q: "I found an internship within weeks. Filtering by county and deadline saved me hours every week." },
              { n: "Brian O.", r: "Volunteer, Kisumu", q: "Volunteering gave me leadership experience I now talk about in every interview." },
              { n: "Grace M.", r: "Scholarship recipient, Mombasa", q: "I didn't know scholarships like this existed until I saw them all in one place." },
            ].map((t) => (
              <figure key={t.n} className="rounded-2xl border bg-card p-7 shadow-card">
                <Quote className="size-7 text-brand" />
                <blockquote className="mt-4 text-foreground">"{t.q}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary-soft font-semibold text-primary">{t.n[0]}</span>
                  <span><span className="block text-sm font-semibold">{t.n}</span><span className="text-xs text-muted-foreground">{t.r}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">Sample testimonials for illustration only — not real users.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-hero px-8 py-14 text-center text-navy-foreground">
            <div className="grid-dots absolute inset-0" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Are you an organization?</h2>
              <p className="mx-auto mt-3 max-w-xl text-navy-foreground/75">Post internships, scholarships and programs for free and reach motivated young talent across East Africa.</p>
              <Button variant="hero" size="xl" className="mt-7" asChild><Link to="/auth" search={{ mode: "signup" }}>Post an opportunity</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block" aria-hidden>
      <div className="animate-float absolute left-0 top-6 w-80 rounded-2xl bg-card p-5 text-foreground shadow-lift">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary-soft font-bold text-primary">ST</div>
          <div><p className="text-xs text-muted-foreground">Savanna Tech Labs</p><p className="font-semibold">Software Engineering Intern</p></div>
        </div>
        <div className="mt-4 flex gap-2 text-xs"><span className="rounded-md bg-accent px-2 py-1 text-accent-foreground">Internship</span><span className="rounded-md bg-secondary px-2 py-1">Hybrid</span></div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="size-3.5" />Nairobi</span><span className="flex items-center gap-1 text-warning"><CalendarClock className="size-3.5" />5 days left</span></div>
      </div>
      <div className="animate-float-slow absolute bottom-10 right-0 w-72 rounded-2xl bg-card p-5 text-foreground shadow-lift">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Application tracker</p>
        {[["Digital Skills Bootcamp", "Shortlisted"], ["STEM Scholarship", "Applied"], ["Community Volunteer", "Interview"]].map(([t, s]) => (
          <div key={t} className="mt-3 flex items-center justify-between text-sm"><span>{t}</span><span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-accent-foreground">{s}</span></div>
        ))}
      </div>
      <div className="absolute right-6 top-0 grid size-20 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-lift"><Briefcase className="size-9" /></div>
    </div>
  );
}
