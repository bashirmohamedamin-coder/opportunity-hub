import { createFileRoute } from "@tanstack/react-router";
import { SdgSection } from "@/components/home/SdgSection";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About OpportunityHub" }, { name: "description", content: "Our mission, vision and SDG impact." }, { property: "og:title", content: "About OpportunityHub" }, { property: "og:description", content: "Our mission, vision and SDG impact." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <div>
      <section className="bg-hero py-16 text-navy-foreground"><div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold">About OpportunityHub</h1>
        <p className="mt-4 text-navy-foreground/75">Many young people in Kenya and East Africa miss opportunities simply because they never hear about them. OpportunityHub brings students, graduates, young professionals, NGOs, companies, universities and training institutions together in one place.</p>
      </div></section>
      <section className="container-page grid gap-6 py-14 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-7 shadow-card"><h2 className="text-xl font-semibold">Mission</h2><p className="mt-2 text-muted-foreground">To make career development and professional opportunities more accessible to young people.</p></div>
        <div className="rounded-2xl border bg-card p-7 shadow-card"><h2 className="text-xl font-semibold">Vision</h2><p className="mt-2 text-muted-foreground">A connected generation where every young person has equal access to opportunities to learn, grow, and succeed.</p></div>
      </section>
      <SdgSection />
    </div>
  ),
});
