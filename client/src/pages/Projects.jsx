import { useEffect, useState } from "react";
import {
  FolderKanban,
  Plus,
  ArrowUpRight,
  X,
  CheckCircle2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#22c55e",
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#8b5cf6",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    setError("");
    setLoading(true);

    try {
      const [p, t] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
      ]);

      setProjects(p.data.projects || []);
      setTasks(t.data.tasks || []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/projects", form);

      setProjects((old) => [data.project, ...old]);
      setForm({
        name: "",
        description: "",
        color: "#8b5cf6",
      });
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
            <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-violet-400">
              <Sparkles size={15} />
              MAKE IT HAPPEN
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your projects<span className="text-violet-400">.</span>
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Every big thing starts with a project.
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
            New project
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-red-500/10"
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.03]"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (

          /* Empty state */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
              <FolderKanban size={30} />
            </div>

            <h2 className="text-xl font-semibold">
              Nothing on the board. Yet.
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Create your first project and give your ideas a home.
              Your next big thing starts here.
            </p>

            <button
              onClick={() => {
                setError("");
                setShow(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              <Plus size={17} />
              Create your first project
            </button>
          </div>

        ) : (

          /* Project cards */
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => {
              const list = tasks.filter(
                (t) =>
                  (t.project?._id || t.project) === p._id
              );

              const done = list.filter(
                (t) => t.status === "done"
              ).length;

              const progress = list.length
                ? Math.round((done / list.length) * 100)
                : 0;

              return (
                <article
                  key={p._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111119] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-[#14141f] hover:shadow-2xl hover:shadow-black/20 sm:p-6"
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-[0.07] blur-3xl transition-opacity group-hover:opacity-20"
                    style={{ background: p.color }}
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: `${p.color}15`,
                        borderColor: `${p.color}35`,
                        color: p.color,
                      }}
                    >
                      <FolderKanban size={23} />
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/tasks")}
                      aria-label={`Open tasks for ${p.name}`}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-zinc-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>

                  <h2 className="relative mt-5 truncate text-lg font-semibold tracking-tight">
                    {p.name}
                  </h2>

                  <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-zinc-400">
                    {p.description || "A new space for good work."}
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">
                        Project progress
                      </span>
                      <span
                        className="font-semibold tabular-nums"
                        style={{ color: p.color }}
                      >
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: p.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Layers3 size={15} />
                      <span>{list.length} tasks</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-zinc-300">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-400"
                      />
                      <span>{done} completed</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Create project modal */}
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
              onSubmit={create}
              className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111119] p-5 shadow-2xl shadow-black/50 sm:p-7"
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs font-bold tracking-[0.2em] text-violet-400">
                    NEW WORKSPACE ITEM
                  </div>
                  <h2 className="text-2xl font-bold">
                    Create a project
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Give your next idea a name and a color.
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
                    Project name
                  </span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Website redesign"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">
                    Description
                    <span className="ml-2 font-normal text-zinc-500">
                      (optional)
                    </span>
                  </span>
                  <textarea
                    className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-[#09090f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="What are you building?"
                    maxLength={1000}
                  />
                </label>

                <div>
                  <span className="block text-sm font-medium text-zinc-200">
                    Project color
                  </span>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        type="button"
                        key={color}
                        aria-label={`Choose ${color}`}
                        aria-pressed={form.color === color}
                        onClick={() =>
                          setForm({ ...form, color })
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition hover:scale-110 ${
                          form.color === color
                            ? "border-white ring-2 ring-white/20"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {form.color === color && (
                          <CheckCircle2
                            size={18}
                            className="text-white"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create project
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