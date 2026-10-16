import { useEffect, useState } from "react";
import {
  Mail,
  Plus,
  ShieldCheck,
  Users,
  X,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Crown,
} from "lucide-react";
import api, { getErrorMessage } from "../services/api";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.get("/teams/members");
      setMembers(data.members || []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const invite = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/teams/members", {
        email: email.trim(),
        role,
      });

      setMembers(data.members || []);
      setEmail("");
      setRole("member");
      setShow(false);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-violet-400">
              <Sparkles size={15} />
              BETTER, TOGETHER
            </span>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your team<span className="text-violet-400">.</span>
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Great things happen when the right people connect.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShow(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add member
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-red-500/10"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Workspace summary */}
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111119] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
                <Users size={27} />
              </div>

              <div>
                <p className="text-sm text-zinc-400">
                  Total team members
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {loading ? "—" : members.length}
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    {members.length === 1 ? "member" : "members"}
                  </span>
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Your workspace is better when everyone is in the loop.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Workspace active
            </div>
          </div>
        </section>

        {/* Team member list */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111119]">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                People in your workspace
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Manage your collaboration circle
              </p>
            </div>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-2 text-sm font-semibold text-zinc-300">
              {loading ? "—" : members.length}
            </span>
          </div>

          {/* List header */}
          <div className="hidden grid-cols-[minmax(0,1fr)_140px] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:grid">
            <span>Member</span>
            <span>Workspace role</span>
          </div>

          {loading ? (
            <div className="space-y-4 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-11 w-11 rounded-xl bg-white/[0.07]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-white/[0.07]" />
                    <div className="h-3 w-48 max-w-full rounded bg-white/[0.05]" />
                  </div>
                  <div className="h-7 w-20 rounded-lg bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
                <Users size={26} />
              </div>

              <h3 className="text-lg font-semibold">
                Your team starts here
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                Add your teammates to bring everyone into your workspace
                and start collaborating.
              </p>

              <button
                onClick={() => {
                  setError("");
                  setShow(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
              >
                <UserPlus size={17} />
                Add your first member
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {members.map((m, i) => {
                const name = m.user?.name || "Unknown user";
                const memberEmail = m.user?.email || "No email available";
                const isOwner = m.role === "owner";
                const isAdmin = m.role === "admin";

                return (
                  <div
                    key={m.user?._id || memberEmail || i}
                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.025] sm:grid sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center sm:gap-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-base font-bold text-violet-300">
                        {name[0]?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-zinc-100">
                            {name}
                          </p>

                          {isOwner && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                              <Crown size={11} />
                              Owner
                            </span>
                          )}
                        </div>

                        <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-zinc-400 sm:text-sm">
                          <Mail size={13} className="shrink-0" />
                          <span className="truncate">{memberEmail}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pl-14 sm:pl-0">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize ${
                          isOwner
                            ? "border-amber-400/20 bg-amber-400/[0.08] text-amber-300"
                            : isAdmin
                              ? "border-sky-400/20 bg-sky-400/[0.08] text-sky-300"
                              : "border-white/10 bg-white/[0.04] text-zinc-300"
                        }`}
                      >
                        <ShieldCheck size={14} />
                        {m.role || "member"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Invitation information */}
        <section className="flex items-start gap-4 rounded-2xl border border-sky-400/15 bg-sky-400/[0.04] p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.08] text-sky-300">
            <Mail size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              How invitations work
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Members must create a TaskFlow AI account first. Add their
              registered email to give them access to your workspace.
              Actual permissions depend on your backend role checks.
            </p>
          </div>
        </section>

        {/* Add member modal */}
        {show && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !busy) {
                setShow(false);
              }
            }}
          >
            <form
              onSubmit={invite}
              className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111119] p-5 shadow-2xl shadow-black/50 sm:p-7"
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-violet-400">
                    <UserPlus size={14} />
                    GROW YOUR TEAM
                  </span>
                  <h2 className="text-2xl font-bold">
                    Add a member
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Invite someone to collaborate with you.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setShow(false)}
                  aria-label="Close modal"
                  className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">
                    Member's email
                  </span>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-[#09090f] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teammate@company.com"
                      autoComplete="email"
                      maxLength={254}
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">
                    Workspace role
                  </span>
                  <select
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="member">
                      Member — can collaborate
                    </option>
                    <option value="admin">
                      Admin — can manage members
                    </option>
                  </select>
                </label>

                <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  <p className="text-xs leading-5 text-zinc-400">
                    The user must already have a TaskFlow AI account.
                    Only assign admin access to people you trust.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setShow(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={busy || !email.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding member...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}