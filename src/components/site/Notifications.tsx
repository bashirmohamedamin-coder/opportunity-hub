import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, CalendarClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { daysUntil, isClosingSoon, OPP_SELECT, type Opportunity } from "@/lib/opportunities";

export function useDeadlineAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved", "alerts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_opportunities").select(`opportunities(${OPP_SELECT})`);
      if (error) throw error;
      return (data.map((d) => d.opportunities).filter(Boolean) as unknown as Opportunity[])
        .filter((o) => isClosingSoon(o.deadline))
        .sort((a, b) => a.deadline.localeCompare(b.deadline));
    },
  });
}

export function NotificationsBell() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: notes = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(15);
      if (error) throw error;
      return data;
    },
  });
  const { data: alerts = [] } = useDeadlineAlerts();
  const unread = notes.filter((n) => !n.read).length + alerts.length;
  const markRead = useMutation({
    mutationFn: async () => {
      await supabase.from("notifications").update({ read: true }).eq("read", false);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <Popover onOpenChange={(o) => !o && notes.some((n) => !n.read) && markRead.mutate()}>
      <PopoverTrigger className="relative grid size-9 place-items-center rounded-lg hover:bg-muted" aria-label="Notifications">
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">{unread}</span>}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3 text-sm font-semibold">Notifications</div>
        <div className="max-h-96 overflow-y-auto">
          {alerts.length === 0 && notes.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>}
          {alerts.map((o) => (
            <Link key={o.id} to="/opportunities/$id" params={{ id: o.id }} className="flex gap-3 border-b px-4 py-3 text-sm hover:bg-muted">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-warning" />
              <span><span className="font-medium">Deadline approaching:</span> {o.title} closes in {daysUntil(o.deadline)} day{daysUntil(o.deadline) === 1 ? "" : "s"}.</span>
            </Link>
          ))}
          {notes.map((n) => (
            <a key={n.id} href={n.link ?? "#"} className="block border-b px-4 py-3 text-sm hover:bg-muted">
              <p className="font-medium">{n.title} {!n.read && <span className="ml-1 inline-block size-2 rounded-full bg-brand" />}</p>
              {n.body && <p className="text-muted-foreground">{n.body}</p>}
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
