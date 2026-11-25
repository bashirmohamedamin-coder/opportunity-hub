import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="OpportunityHub home">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-card">
        <Compass className="size-5" />
      </span>
      <span className={cn("font-display text-lg font-bold tracking-tight", inverted ? "text-navy-foreground" : "text-navy")}>
        Opportunity<span className="text-brand">Hub</span>
      </span>
    </Link>
  );
}
