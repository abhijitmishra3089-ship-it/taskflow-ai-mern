
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ClipboardList,
  LoaderCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import api, { getErrorMessage } from "../services/api";

const suggestions = [
  "Launch a personal portfolio",
  "Build a mobile-friendly store",
  "Plan a team onboarding flow",
];

export default function AIPlanner() {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    setTasks([]);
    setCopied(false);

    try {
      const { data } = await api.post("/ai/breakdown", { goal });
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      const text = tasks
        .map(
          (task, i) =>
            `${i + 1}. ${task.title}\n   ${task.description}`,
        )
        .join("\n\n");

      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Unable to copy the plan. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 text-zinc-100">
      {/* Page heading */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-violet-400">
            YOUR AI TEAMMATE
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From idea to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              action.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Tell AI what you want to achieve. Get a plan you can actually work
            with.
          </p>
        </div>

        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 sm:flex">
          <Sparkles size={26} />
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        {/* Goal input panel */}
        <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111116] p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <WandSparkles size={20} />
            </span>

            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                What are we working on?
              </h2>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Describe your goal in a few sentences.
              </p>
            </div>
          </div>

          <form onSubmit={generate} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Your project goal
              </span>

              <textarea
                className="min-h-40 w-full resize-y rounded-xl border border-white/10 bg-[#09090d] px-4 py-3.5 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Build a responsive portfolio website with a project gallery, contact form, and dark mode. I want to launch it in two weeks."
                minLength={8}
                maxLength={3000}
                required
                disabled={busy}
              />
            </label>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles size={14} className="shrink-0 text-violet-400" />
              Be specific for a more useful plan.
              <span className="ml-auto tabular-nums">
                {goal.length}/3000
              </span>
            </div>

            <button
              type="submit"
              disabled={busy || goal.trim().length < 8}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition hover:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  Generate task plan
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-7">
            <div className="mb-3 text-[10px] font-bold tracking-[0.18em] text-zinc-500">
              NEED AN IDEA?
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setGoal(suggestion);
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-left text-xs text-zinc-400 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08] hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                  <ArrowRight size={12} className="shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-6 text-red-300"
            >
              {error}
            </div>
          )}
        </section>

        {/* Results panel */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111116] p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-5">
            <div>
              <h2 className="text-lg font-semibold">Your action plan</h2>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {busy
                  ? "AI is creating your plan..."
                  : tasks.length
                    ? `${tasks.length} suggested tasks`
                    : "Your generated tasks will appear here"}
              </p>
            </div>

            {tasks.length > 0 && (
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-violet-400/30 hover:text-violet-300"
              >
                {copied ? (
                  <Check size={15} className="text-emerald-400" />
                ) : (
                  <ClipboardList size={15} />
                )}
                {copied ? "Copied!" : "Copy plan"}
              </button>
            )}
          </div>

          {busy ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <Sparkles size={30} className="animate-pulse" />
              </div>
              <h3 className="mt-5 text-sm font-semibold">
                Building your action plan
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-500">
                Breaking your goal into practical steps. This may take a
                moment.
              </p>
              <LoaderCircle
                size={19}
                className="mt-5 animate-spin text-violet-400"
              />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-3 py-10 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-blue-500/10 text-violet-300">
                <Bot size={39} />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border border-violet-400/20 bg-[#19151f] text-violet-300">
                  <Sparkles size={16} />
                </span>
              </div>

              <h3 className="mt-6 text-sm font-semibold">
                Good plans start with a prompt.
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-6 text-zinc-500">
                Enter your goal and let AI map out the next steps.
              </p>

              <div className="mt-6 w-full max-w-xs space-y-2">
                <div className="h-2 w-full animate-pulse rounded-full bg-white/[0.05]" />
                <div className="h-2 w-4/5 animate-pulse rounded-full bg-white/[0.05]" />
                <div className="h-2 w-3/5 animate-pulse rounded-full bg-white/[0.05]" />
              </div>
            </div>
          ) : (
            <div className="max-h-[600px] space-y-3 overflow-y-auto py-5 pr-1">
              {tasks.map((task, index) => {
                const priority = ["low", "medium", "high"].includes(
                  String(task.priority).toLowerCase(),
                )
                  ? String(task.priority).toLowerCase()
                  : "medium";

                const priorityStyles = {
                  low: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
                  medium:
                    "border-amber-400/20 bg-amber-400/10 text-amber-300",
                  high: "border-red-400/20 bg-red-400/10 text-red-300",
                };

                return (
                  <article
                    key={`${task.title}-${index}`}
                    className="group flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-violet-400/20 hover:bg-white/[0.035] sm:gap-4 sm:p-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-xs font-bold text-violet-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-semibold text-zinc-100">
                        {task.title}
                      </h3>

                      <p className="mt-2 whitespace-pre-line break-words text-xs leading-6 text-zinc-400">
                        {task.description}
                      </p>

                      <span
                        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${priorityStyles[priority]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {priority} priority
                      </span>
                    </div>

                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/[0.08] text-emerald-400 opacity-70 transition group-hover:opacity-100">
                      <Check size={15} />
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Disclaimer */}
      <p className="flex items-start gap-2 pb-2 text-xs leading-5 text-zinc-500">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-400" />
        AI suggestions are a starting point. Review and adjust tasks to fit
        your team&apos;s workflow.
      </p>
    </div>
  );
}
