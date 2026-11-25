import { cn } from "@/lib/utils";

export function OrgLogo({ name, url, className }: { name: string; url?: string | null; className?: string }) {
  const initials = name.replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return url ? (
    <img src={url} alt={`${name} logo`} className={cn("size-12 shrink-0 rounded-xl border bg-card object-cover", className)} />
  ) : (
    <div aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft font-display text-sm font-bold text-primary", className)}>
      {initials || "?"}
    </div>
  );
}
