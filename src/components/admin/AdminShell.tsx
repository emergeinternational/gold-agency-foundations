import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { BarChart3, FileText, Home, LayoutDashboard, LogOut, Megaphone, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Applications", to: "/admin/review", icon: Users },
  { label: "Applicants", to: "/admin/review", icon: Search },
  { label: "Opportunities", to: "/admin/opportunities", icon: BarChart3 },
  { label: "Banners", to: "/admin/banners", icon: Megaphone },
  { label: "Inquiries", to: "/admin/partners", icon: FileText },
];

export default function AdminShell({ title, description, children }: AdminShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  const activeItem = [...navItems].reverse().find((item) => location.pathname === item.to);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container-wide px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link to="/admin" className="text-[10px] uppercase tracking-[0.2em] text-primary">
                Ascend Elite Operations
              </Link>
              <h1 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">{title}</h1>
              {description && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                Dashboard / {activeItem?.label ?? title}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Website
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/60 bg-secondary/20 text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container-wide px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
