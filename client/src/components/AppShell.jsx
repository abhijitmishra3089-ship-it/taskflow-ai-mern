
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  Bot,
  CheckSquare,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Users,
  X,
  Zap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/board", label: "My tasks", icon: CheckSquare },
  { to: "/team", label: "Team", icon: Users },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const currentPage =
    nav.find(
      (item) =>
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
    )?.label ||
    (location.pathname === "/ai" ? "AI task planner" : "Overview");

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const goTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            mobile
              ? `flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-[10px] font-medium transition ${
                  isActive
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-500 hover:text-zinc-200"
                }`
              : ({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border border-violet-400/15 bg-violet-500/10 text-violet-300"
                      : "border border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`
          }
        >
          <Icon size={18} />
          <span className={mobile ? "max-w-full truncate" : "flex-1"}>
            {label}
          </span>

          {!mobile && to === "/dashboard" && (
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 opacity-0 group-[.active]:opacity-100" />
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-[#09090f] text-zinc-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.07] bg-[#0e0e14] px-4 py-5 lg:flex">
        {/* Brand */}
        <button
          type="button"
          onClick={() => goTo("/dashboard")}
          className="mb-8 flex items-center gap-3 px-2 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/20">
            <Zap size={21} fill="currentColor" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            taskflow<span className="text-violet-400">.ai</span>
          </span>
        </button>

        {/* Workspace switcher */}
        <button
          type="button"
          className="mb-7 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.05]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-blue-500/20 text-sm font-bold text-violet-200">
            T
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-zinc-200">
              Team workspace
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              Free plan
            </span>
          </span>

          <ChevronDown size={16} className="text-zinc-500" />
        </button>

        {/* Main navigation */}
        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-zinc-600">
          WORKSPACE
        </p>

        <nav className="space-y-1">
          <NavItems />
        </nav>

        {/* AI navigation */}
        <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[0.18em] text-zinc-600">
          TOOLS
        </p>

        <NavLink
          to="/ai"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium transition ${
              isActive
                ? "border-violet-400/15 bg-violet-500/10 text-violet-300"
                : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
            }`
          }
        >
          <Bot size={18} />
          <span className="flex-1">AI task planner</span>
          <span className="rounded-md border border-violet-400/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-300">
            AI
          </span>
        </NavLink>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.12] to-blue-500/[0.04] p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <Zap size={17} />
            </span>

            <h3 className="mt-4 text-sm font-semibold text-zinc-100">
              Make work flow.
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-zinc-400">
              Plan smarter with your AI teammate.
            </p>

            <button
              type="button"
              onClick={() => goTo("/ai")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-400"
            >
              Try AI planner
              <Plus size={14} />
            </button>
          </div>

          {/* User profile */}
          <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/15 text-sm font-semibold text-violet-200">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {user?.email || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Log out"
              aria-label="Log out"
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#0e0e14] p-4 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo("/dashboard")}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500">
              <Zap size={19} fill="currentColor" />
            </span>
            <span className="text-lg font-bold">
              taskflow<span className="text-violet-400">.ai</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-white/[0.08] p-3">
          <p className="text-sm font-semibold">Team workspace</p>
          <p className="mt-1 text-xs text-zinc-500">Free plan</p>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-zinc-600">
          WORKSPACE
        </p>

        <nav className="space-y-1">
          <NavItems />
        </nav>

        <p className="mb-3 mt-7 px-3 text-[10px] font-bold tracking-[0.18em] text-zinc-600">
          TOOLS
        </p>

        <NavLink
          to="/ai"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
              isActive
                ? "bg-violet-500/10 text-violet-300"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Bot size={18} />
          AI task planner
          <span className="ml-auto rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-300">
            AI
          </span>
        </NavLink>

        <div className="mt-auto border-t border-white/[0.07] pt-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 font-semibold text-violet-200">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out..." : "Log out"}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="min-h-screen lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#09090f]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-white/10 p-2 text-zinc-300 hover:bg-white/5 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-zinc-500 sm:inline">
                Workspace
              </span>
              <span className="hidden text-zinc-700 sm:inline">/</span>
              <span className="truncate font-semibold text-zinc-200">
                {currentPage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs text-zinc-500">
                All systems operational
              </span>
            </div>

            <div className="hidden h-6 w-px bg-white/10 sm:block" />

            <button
              type="button"
              title="Activity"
              aria-label="Activity"
              className="rounded-xl border border-white/[0.08] p-2.5 text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Activity size={17} />
            </button>

            <button
              type="button"
              onClick={() => goTo("/dashboard")}
              title={user?.name || "Profile"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15 text-sm font-semibold text-violet-200"
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </button>
          </div>
        </header>

        {/* Nested page */}
        <div className="mx-auto w-full max-w-[1600px] p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/[0.08] bg-[#0e0e14]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-[10px] font-medium transition ${
                isActive
                  ? "text-violet-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`
            }
          >
            <Icon size={19} />
            <span className="max-w-full truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
