import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My dashboard – OpportunityHub" }, { name: "description", content: "My dashboard" }] }),
  component: () => (
    <div className="container-page py-16"><h1 className="text-3xl font-bold">My dashboard</h1>
    <p className="mt-2 text-muted-foreground">This section is still being built.</p></div>
  ),
});
