import { Link } from "@tanstack/react-router";
import { CalendarClock, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { categoryMeta, deadlineLabel, isClosingSoon, workModeLabel, type Opportunity } from "@/lib/opportunities";
import { OrgLogo } from "./OrgLogo";
import { SaveButton } from "./SaveButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoBadge() {
  return <Badge variant="outline" className="border-warning/40 bg-warning-soft text-[10px] font-semibold uppercase tracking-wide text-foreground">Demo listing</Badge>;
}

export function OpportunityCard({ o }: { o: Opportunity }) {
  const cat = categoryMeta(o.category);
  const soon = isClosingSoon(o.deadline);
  return (
    <article className="card-hover group relative flex flex-col rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <OrgLogo name={o.organizations?.name ?? "Org"} url={o.organizations?.logo_url} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">{o.organizations?.name}</p>
          <h3 className="mt-0.5 line-clamp-2 text-base font-semibold leading-snug">
            <Link to="/opportunities/$id" params={{ id: o.id }} className="after:absolute after:inset-0 after:rounded-2xl">
              {o.title}
            </Link>
          </h3>
        </div>
        <div className="relative z-10"><SaveButton opportunityId={o.id} /></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge className="gap-1 bg-accent text-accent-foreground hover:bg-accent"><cat.icon className="size-3" />{cat.label}</Badge>
        <Badge variant="secondary">{workModeLabel(o.work_mode)}</Badge>
        {o.is_demo && <DemoBadge />}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{o.short_description}</p>
      <dl className="mt-4 grid gap-1.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /><dd>{o.location}</dd></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="size-4" /><dd>{o.participation_type}</dd></div>
        <div className={cn("flex items-center gap-2", soon ? "font-medium text-warning" : "text-muted-foreground")}>
          <CalendarClock className="size-4" /><dd>Deadline: {deadlineLabel(o.deadline)}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-5">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-brand">
          View details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-card p-5">
      <div className="flex gap-3"><div className="size-12 rounded-xl bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-4 w-4/5 rounded bg-muted" /></div></div>
      <div className="mt-4 h-3 w-full rounded bg-muted" /><div className="mt-2 h-3 w-2/3 rounded bg-muted" />
      <div className="mt-6 h-3 w-1/3 rounded bg-muted" />
    </div>
  );
}
