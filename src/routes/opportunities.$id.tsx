import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OPP_SELECT, deadlineLabel, type Opportunity } from "@/lib/opportunities";
import { SaveButton } from "@/components/site/SaveButton";
import { DemoBadge } from "@/components/site/OpportunityCard";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/opportunities/$id")({
  head: () => ({ meta: [{ title: "Opportunity details – OpportunityHub" }, { name: "description", content: "Eligibility, benefits and how to apply." }, { property: "og:title", content: "Opportunity details – OpportunityHub" }, { property: "og:description", content: "Eligibility, benefits and how to apply." }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Details,
});
function Details() {
  const { id } = Route.useParams();
  const { data: o, isLoading } = useQuery({ queryKey: ["opp", id], queryFn: async () => { const { data, error } = await supabase.from("opportunities").select(OPP_SELECT).eq("id", id).maybeSingle(); if (error) throw error; return data as Opportunity | null; } });
  if (isLoading) return <div className="container-page py-16 text-muted-foreground">Loading…</div>;
  if (!o) return <div className="container-page py-16">Opportunity not found.</div>;
  const List = ({ t, items }: { t: string; items: string[] }) => items.length ? <section className="mt-8"><h2 className="text-lg font-semibold">{t}</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{items.map((i) => <li key={i}>{i}</li>)}</ul></section> : null;
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="text-sm text-muted-foreground">{o.organizations?.name}</p>
      <h1 className="mt-1 text-3xl font-bold">{o.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground"><span>{o.location}</span>·<span>{o.participation_type}</span>·<span>Deadline: {deadlineLabel(o.deadline)}</span>{o.is_demo && <DemoBadge />}</div>
      <div className="mt-6 flex gap-3">{o.external_url && <Button variant="brand" size="lg" asChild><a href={o.external_url} target="_blank" rel="noreferrer">Apply Now</a></Button>}<SaveButton opportunityId={o.id} variant="full" /></div>
      <p className="mt-8 whitespace-pre-line">{o.description}</p>
      <List t="Eligibility" items={o.eligibility} /><List t="Skills & qualifications" items={o.skills} /><List t="Benefits" items={o.benefits} />
      {o.application_instructions && <section className="mt-8"><h2 className="text-lg font-semibold">How to apply</h2><p className="mt-2 text-muted-foreground">{o.application_instructions}</p></section>}
    </div>
  );
}
