
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Sparkles } from "lucide-react";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4 text-white">
        {/* Background effects */}
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Loading content */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
          <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 shadow-lg shadow-violet-500/10">
            <Zap
              size={30}
              className="text-violet-300"
              fill="currentColor"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#09090f] bg-violet-500">
              <Sparkles size={11} className="text-white" />
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight">
            TaskFlow
            <span className="text-violet-400">.ai</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Preparing your workspace
          </p>

          <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-blue-400" />
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            Loading your projects and tasks...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
