import { UserButton } from "@clerk/clerk-react";
import { BookOpen, LayoutDashboard, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router";

const navLinks = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Problems",
    url: "/problems",
    icon: BookOpen,
  },
];

const ProtectedRouteNavbar = () => (
  <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 shadow-lg sticky left-0 top-0 z-50">
    <div className="max-w-7xl p-4 mx-auto flex flex-wrap justify-between items-center gap-4">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-3 transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
      >
        <span className="size-10 bg-linear-to-br from-primary via-secondary to-accent rounded-xl shadow-lg inline-flex justify-center items-center">
          <Sparkles className="shrink-0 size-6 text-white" />
        </span>

        <span className="inline-flex flex-col">
          <code className="text-gradient font-mono text-xl font-extrabold tracking-wider">
            Moduo
          </code>
          <span className="text-base-content/60 text-xs font-medium capitalize">
            Code together, live.
          </span>
        </span>
      </Link>

      {/* Nav links and user account management button */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {navLinks.map(({ label, url, icon: NavLinkIcon }) => (
            <NavLink
              key={label}
              to={url}
              aria-label={`Click to visit ${label} page`}
              end
              className={({ isActive }) =>
                `btn ${
                  isActive ? "btn-primary" : "btn-neutral"
                } max-sm:btn-sm rounded-lg`
              }
            >
              <NavLinkIcon className="size-4" />
              <span className="hidden sm:inline font-medium capitalize">
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        <UserButton />
      </div>
    </div>
  </nav>
);

export default ProtectedRouteNavbar;
