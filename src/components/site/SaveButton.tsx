import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function useSavedIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_opportunities").select("opportunity_id");
      if (error) throw error;
      return new Set(data.map((d) => d.opportunity_id));
    },
  });
}

export function SaveButton({ opportunityId, variant = "icon" }: { opportunityId: string; variant?: "icon" | "full" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: saved } = useSavedIds();
  const isSaved = saved?.has(opportunityId) ?? false;

  const m = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth");
      if (isSaved) {
        const { error } = await supabase.from("saved_opportunities").delete().eq("opportunity_id", opportunityId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_opportunities").insert({ opportunity_id: opportunityId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isSaved ? "Removed from saved" : "Saved to your dashboard");
      qc.invalidateQueries({ queryKey: ["saved-ids"] });
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
    onError: () => toast.error("Could not update saved opportunities"),
  });

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Sign in to save opportunities");
      navigate({ to: "/auth" });
      return;
    }
    m.mutate();
  };

  const Icon = isSaved ? BookmarkCheck : Bookmark;
  if (variant === "full")
    return (
      <Button variant="outline" size="lg" onClick={onClick} disabled={m.isPending}>
        <Icon className={cn(isSaved && "text-brand")} /> {isSaved ? "Saved" : "Save opportunity"}
      </Button>
    );
  return (
    <button
      onClick={onClick}
      disabled={m.isPending}
      aria-label={isSaved ? "Remove from saved" : "Save opportunity"}
      className={cn("grid size-9 place-items-center rounded-lg border bg-card transition-colors hover:bg-accent", isSaved && "border-brand/40 bg-brand-soft text-brand")}
    >
      <Icon className="size-4" />
    </button>
  );
}
