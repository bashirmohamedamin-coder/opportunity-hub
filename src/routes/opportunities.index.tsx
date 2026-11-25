import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, KENYA_COUNTIES, OPP_SELECT, WORK_MODES, type Opportunity } from "@/lib/opportunities";
import { OpportunityCard, OpportunityCardSkeleton } from "@/components/site/OpportunityCard";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type U = string | undefined;
type S = { q?: U; category?: U; county?: U; org?: U; mode?: U; deadline?: U; sort?: U };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/opportunities/")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: str(s["q"]), category: str(s["category"]), county: str(s["county"]), org: str(s["org"]),
    mode: str(s["mode"]), deadline: str(s["deadline"]), sort: str(s["sort"]),
  }),
  head: () => ({
    meta: [
      { title: "Browse Opportunities – OpportunityHub" },
      { name: "description", content: "Search and filter internships, volunteer roles, scholarships and training programs in Kenya and East Africa." },
      { property: "og:title", content: "Browse Opportunities – OpportunityHub" },
      { property: "og:description", content: "Internships, scholarships, volunteering and training in one searchable directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

const ALL = "all";

function OpportunitiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/opportunities/" });
  const [q, setQ] = useState(search.q ?? "");
  useEffect(() => setQ(search.q ?? ""), [search.q]);
  const set = (patch: Partial<S>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const orgs = useQuery({
    queryKey: ["orgs", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("id,name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const list = useQuery({
    queryKey: ["opps", "list", search],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      let qb = supabase.from("opportunities").select(OPP_SELECT).eq("status", "published").gte("deadline", today);
      if (search.category) qb = qb.eq("category", search.category);
      if (search.county) qb = qb.eq("county", search.county);
      if (search.org) qb = qb.eq("organization_id", search.org);
      if (search.mode) qb = qb.eq("work_mode", search.mode);
      if (search.deadline) {
        const d = new Date(); d.setDate(d.getDate() + Number(search.deadline));
        qb = qb.lte("deadline", d.toISOString().slice(0, 10));
      }
      if (search.q) {
        const term = search.q.replace(/[%,()]/g, " ").trim();
        qb = qb.or(`title.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`);
      }
      qb = search.sort === "closing" ? qb.order("deadline", { ascending: true }) : qb.order("created_at", { ascending: false });
      const { data, error } = await qb;
      if (error) throw error;
      return data as Opportunity[];
    },
  });

  const activeCount = [search.category, search.county, search.org, search.mode, search.deadline, search.q].filter(Boolean).length;

  return (
    <div>
      <section className="border-b bg-hero text-navy-foreground">
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold sm:text-4xl">Explore opportunities</h1>
          <p className="mt-2 text-navy-foreground/70">Internships, volunteering, scholarships and training programs across Kenya and East Africa.</p>
          <form onSubmit={(e) => { e.preventDefault(); set({ q: q.trim() || undefined }); }} className="mt-6 flex max-w-2xl gap-2 rounded-2xl bg-card p-2 shadow-lift" role="search">
            <Search className="ml-2 mt-2.5 size-5 shrink-0 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keywords, skills or location" aria-label="Search keywords"
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
            <Button type="submit" variant="brand" size="lg">Search</Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip active={!search.category} onClick={() => set({ category: undefined })}>All</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.value} active={search.category === c.value} onClick={() => set({ category: c.value })}><c.icon className="size-4" />{c.plural}</Chip>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="size-4" /> Filters</h2>
            {activeCount > 0 && <button onClick={() => navigate({ search: {}, replace: true })} className="flex items-center gap-1 text-sm text-primary hover:underline"><X className="size-3.5" />Clear all</button>}
          </div>
          <Filter label="Location / county" value={search.county} onChange={(v) => set({ county: v })} options={KENYA_COUNTIES.map((c) => ({ value: c, label: c }))} />
          <Filter label="Work mode" value={search.mode} onChange={(v) => set({ mode: v })} options={WORK_MODES} />
          <Filter label="Application deadline" value={search.deadline} onChange={(v) => set({ deadline: v })} options={[{ value: "7", label: "Within 7 days" }, { value: "14", label: "Within 14 days" }, { value: "30", label: "Within 30 days" }]} />
          <Filter label="Organization" value={search.org} onChange={(v) => set({ org: v })} options={(orgs.data ?? []).map((o) => ({ value: o.id, label: o.name }))} />
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {list.isLoading ? "Loading…" : `${list.data?.length ?? 0} opportunit${list.data?.length === 1 ? "y" : "ies"} found`}
              {search.q && <> for "<span className="font-medium text-foreground">{search.q}</span>"</>}
            </p>
            <Select value={search.sort ?? "newest"} onValueChange={(v) => set({ sort: v === "newest" ? undefined : v })}>
              <SelectTrigger className="w-44" aria-label="Sort"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="closing">Closing soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {list.error && <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Couldn't load opportunities. Check your connection and try again.</p>}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.isLoading && Array.from({ length: 6 }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
            {list.data?.map((o) => <OpportunityCard key={o.id} o={o} />)}
          </div>
          {list.data?.length === 0 && (
            <EmptyState icon={SearchX} title="No opportunities match your search" text="Try different keywords or remove some filters to see more results."
              action={<Button variant="outline" onClick={() => navigate({ search: {}, replace: true })}>Clear filters</Button>} />
          )}
          <p className="mt-8 text-center text-xs text-muted-foreground">Listings marked "Demo listing" are sample content for demonstration. <Link to="/about" className="underline">Learn more</Link></p>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active ? "border-brand bg-brand text-brand-foreground" : "border-navy-foreground/20 bg-navy-foreground/5 text-navy-foreground hover:bg-navy-foreground/15")}>
      {children}
    </button>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value?: string | undefined; onChange: (v?: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
        <SelectTrigger className="w-full bg-card" aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
