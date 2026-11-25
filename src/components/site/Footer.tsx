import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import { Logo } from "./Logo";

export const SOCIALS = [
  { href: "https://www.linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "https://x.com", label: "X (Twitter)", icon: Twitter },
  { href: "https://www.instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://www.facebook.com", label: "Facebook", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">Discover Opportunities. Build Your Future. Connecting young people in Kenya and East Africa with internships, scholarships, volunteering and training.</p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid size-9 place-items-center rounded-lg bg-navy-foreground/10 transition-colors hover:bg-brand">
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/opportunities" className="hover:text-brand">All opportunities</Link></li>
            <li><Link to="/opportunities" search={{ category: "internship" }} className="hover:text-brand">Internships</Link></li>
            <li><Link to="/opportunities" search={{ category: "scholarship" }} className="hover:text-brand">Scholarships</Link></li>
            <li><Link to="/opportunities" search={{ category: "training" }} className="hover:text-brand">Training programs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/about" className="hover:text-brand">About us</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            <li><Link to="/auth" search={{ mode: "signup" }} className="hover:text-brand">For organizations</Link></li>
            <li><a href="mailto:hello@opportunityhub.africa" className="inline-flex items-center gap-1 hover:text-brand"><Mail className="size-3.5" /> hello@opportunityhub.africa</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col justify-between gap-2 py-5 text-xs text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} OpportunityHub. Built for SDG 8, 10 & 17.</p>
          <p>Listings marked "Demo" are sample content, not real opportunities.</p>
        </div>
      </div>
    </footer>
  );
}
