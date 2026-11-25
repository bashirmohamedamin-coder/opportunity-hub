import { GraduationCap, HeartHandshake, Briefcase, Lightbulb, type LucideIcon } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export type Organization = Tables<"organizations">;
export type Opportunity = Tables<"opportunities"> & { organizations: Organization | null };

export const CATEGORIES: { value: string; label: string; plural: string; icon: LucideIcon; blurb: string }[] = [
  { value: "internship", label: "Internship", plural: "Internships", icon: Briefcase, blurb: "Gain real work experience with leading teams." },
  { value: "volunteer", label: "Volunteer", plural: "Volunteer Opportunities", icon: HeartHandshake, blurb: "Give back and grow leadership skills." },
  { value: "scholarship", label: "Scholarship", plural: "Scholarships", icon: GraduationCap, blurb: "Funding to keep learning without barriers." },
  { value: "training", label: "Training", plural: "Training Programs", icon: Lightbulb, blurb: "Build digital, business and career skills." },
];

export const categoryMeta = (v: string) => CATEGORIES.find((c) => c.value === v) ?? CATEGORIES[0]!;

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];
export const workModeLabel = (v: string) => WORK_MODES.find((m) => m.value === v)?.label ?? v;

export const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Machakos", "Kajiado", "Nyeri", "Meru",
  "Kakamega", "Kilifi", "Kisii", "Embu", "Garissa", "Turkana", "Other / East Africa",
];

export const OPP_SELECT = "*, organizations(*)";

/** Whole days from today (local) until the deadline date (YYYY-MM-DD). Negative = passed. */
export function daysUntil(deadline: string, today: Date = new Date()): number {
  const [y, m, d] = deadline.split("-").map(Number);
  const end = Date.UTC(y!, (m ?? 1) - 1, d ?? 1);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((end - start) / 86400000);
}

export function deadlineLabel(deadline: string, today?: Date): string {
  const n = daysUntil(deadline, today);
  if (n < 0) return "Closed";
  if (n === 0) return "Closes today";
  if (n === 1) return "Closes tomorrow";
  if (n <= 7) return `${n} days left`;
  return new Date(deadline + "T00:00:00").toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

/** Deadlines within this many days trigger a reminder. */
export const DEADLINE_ALERT_DAYS = 7;
export const isClosingSoon = (deadline: string, today?: Date) => {
  const n = daysUntil(deadline, today);
  return n >= 0 && n <= DEADLINE_ALERT_DAYS;
};

export function profileCompletion(p: {
  full_name?: string | null; headline?: string | null; bio?: string | null; location?: string | null;
  education?: string | null; skills?: string[] | null; avatar_url?: string | null; phone?: string | null;
} | null): number {
  if (!p) return 0;
  const checks = [
    !!p.full_name?.trim(), !!p.headline?.trim(), !!p.bio?.trim(), !!p.location?.trim(),
    !!p.education?.trim(), (p.skills?.length ?? 0) > 0, !!p.avatar_url, !!p.phone?.trim(),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export const APP_STATUSES = ["interested", "applied", "shortlisted", "interview", "accepted", "rejected", "withdrawn"] as const;
