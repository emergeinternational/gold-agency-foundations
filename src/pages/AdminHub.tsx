import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Megaphone,
  Sparkles,
  Handshake,
  ServerCog,
  ScrollText,
  ArrowRight,
} from "lucide-react";

type AdminCard = {
  title: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: "ready" | "coming";
};

const CARDS: AdminCard[] = [
  {
    title: "Talent Review",
    description:
      "Review submissions, scoring, statuses, levels, notes, assignees, Telegram messages, candidate replies, outcomes, and segmentation.",
    to: "/admin/review",
    icon: Users,
    status: "ready",
  },
  {
    title: "Opportunities Manager",
    description:
      "Create, edit, order, feature, activate, and close opportunity cards shown on the public Opportunities page.",
    to: "/admin/opportunities",
    icon: Sparkles,
    status: "ready",
  },
  {
    title: "Homepage Banner Manager",
    description:
      "Manage the homepage announcement banner messages, CTA links, featured message, timing, and active state.",
    to: "/admin/banners",
    icon: Megaphone,
    status: "ready",
  },
  {
    title: "Partner Inquiries",
    description: "Review and manage Partner With Us inquiries.",
    to: "/admin/partners",
    icon: Handshake,
    status: "coming",
  },
  {
    title: "System Check",
    description: "View safe system readiness checks without exposing secrets.",
    to: "/admin/system",
    icon: ServerCog,
    status: "coming",
  },
  {
    title: "Activity Log",
    description: "View recent admin content changes and operational actions.",
    to: "/admin/activity",
    icon: ScrollText,
    status: "coming",
  },
];

export default function AdminHub() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="container-wide px-5 sm:px-8 lg:px-12 py-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Internal · Admin Hub</p>
            <h1 className="font-display text-2xl sm:text-3xl text-foreground mt-1">Ascend Elite Operations</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">View public site</Link>
          </Button>
        </div>
      </header>

      <main className="container-wide px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const isComing = card.status === "coming";
            return (
              <div
                key={card.to}
                className="card-premium p-6 flex flex-col gap-4 border border-border/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isComing && (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-lg text-foreground">{card.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {card.description}
                  </p>
                </div>
                <Button
                  variant={isComing ? "outline" : "gold-outline"}
                  size="sm"
                  asChild
                  className="self-start"
                  disabled={isComing}
                >
                  {isComing ? (
                    <span className="inline-flex items-center gap-2 opacity-60 cursor-not-allowed">
                      Coming in next phase
                    </span>
                  ) : (
                    <Link to={card.to} className="inline-flex items-center gap-2">
                      Open
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
