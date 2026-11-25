import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const schema = z.object({ name: z.string().trim().min(1, "Name is required").max(100), email: z.string().trim().email("Enter a valid email").max(255), subject: z.string().trim().min(1, "Subject is required").max(150), message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000) });
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact – OpportunityHub" }, { name: "description", content: "Get in touch with the OpportunityHub team." }, { property: "og:title", content: "Contact OpportunityHub" }, { property: "og:description", content: "Get in touch with the OpportunityHub team." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Contact,
});
function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <div className="container-page grid max-w-5xl gap-10 py-16 md:grid-cols-2">
      <div><h1 className="text-4xl font-bold">Contact us</h1><p className="mt-3 text-muted-foreground">Questions, partnerships or feedback — we'd love to hear from you.</p>
        <p className="mt-6 text-sm">Email: <a className="text-primary underline" href="mailto:hello@opportunityhub.africa">hello@opportunityhub.africa</a></p><p className="mt-1 text-sm">Nairobi, Kenya</p></div>
      {sent ? <div className="rounded-2xl border bg-card p-8 shadow-card"><h2 className="text-xl font-semibold">Thank you!</h2><p className="mt-2 text-muted-foreground">Your message has been received.</p><Button className="mt-4" variant="outline" onClick={() => setSent(false)}>Send another</Button></div> :
      <form noValidate className="space-y-4 rounded-2xl border bg-card p-7 shadow-card" onSubmit={(e) => { e.preventDefault(); const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget))); if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; } setErrors({}); setSent(true); toast.success("Message sent"); }}>
        {(["name", "email", "subject"] as const).map((f) => <div key={f}><label className="text-sm font-medium capitalize" htmlFor={f}>{f}</label><Input id={f} name={f} type={f === "email" ? "email" : "text"} className="mt-1" />{errors[f] && <p className="mt-1 text-sm text-destructive">{errors[f]}</p>}</div>)}
        <div><label className="text-sm font-medium" htmlFor="message">Message</label><Textarea id="message" name="message" rows={5} className="mt-1" />{errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}</div>
        <Button type="submit" variant="brand" className="w-full">Send message</Button>
      </form>}
    </div>
  );
}
