import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AdminBackLink() {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary hover:text-gold-light transition-colors"
    >
      <ArrowLeft className="w-3 h-3" />
      Back to Admin Hub
    </Link>
  );
}
