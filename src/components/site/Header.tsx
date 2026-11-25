import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, LayoutDashboard, LogOut, Building2 } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { NotificationsBell } from "./Notifications";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { user, profile, isOrg, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  };
  const name = profile?.full_name || user?.email || "";
  const dash = isOrg ? "/org" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary bg-primary-soft" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NotificationsBell />
              <DropdownMenu>
                <DropdownMenuTrigger className="grid size-9 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-label="Account menu">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="size-full object-cover" /> : name.slice(0, 1).toUpperCase()}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: dash })}>
                    {isOrg ? <Building2 /> : <LayoutDashboard />} {isOrg ? "Organization dashboard" : "My dashboard"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}><LogOut /> Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild><Link to="/auth">Log in</Link></Button>
              <Button variant="brand" asChild><Link to="/auth" search={{ mode: "signup" }}>Join OpportunityHub</Link></Button>
            </div>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="grid size-9 place-items-center rounded-lg hover:bg-muted md:hidden" aria-label="Open menu"><Menu className="size-5" /></SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-muted">{n.label}</Link>
                ))}
                <div className="my-3 border-t" />
                {user ? (
                  <>
                    <Link to={dash} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-muted">Dashboard</Link>
                    <button onClick={() => { setOpen(false); handleSignOut(); }} className="rounded-lg px-3 py-2.5 text-left font-medium hover:bg-muted">Sign out</button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild><Link to="/auth" onClick={() => setOpen(false)}>Log in</Link></Button>
                    <Button variant="brand" className="mt-2" asChild><Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>Join OpportunityHub</Link></Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
