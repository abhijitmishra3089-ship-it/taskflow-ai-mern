
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Layers3,
    title: "Projects with purpose",
    description:
      "Give every initiative a home, a clear goal, and a path forward.",
    color: "text-violet-300 bg-violet-500/10 ring-violet-400/20",
  },
  {
    icon: Check,
    title: "A board that moves",
    description:
      "Move tasks from idea to done and see your team's progress clearly.",
    color: "text-blue-300 bg-blue-500/10 ring-blue-400/20",
  },
  {
    icon: Sparkles,
    title: "AI that gets you started",
    description:
      "Turn a big goal into smaller, actionable steps in seconds.",
    color: "text-pink-300 bg-pink-500/10 ring-pink-400/20",
  },
  {
    icon: Users,
    title: "Better team rhythm",
    description:
      "Bring people together with team roles and shared updates.",
    color: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/20",
  },
  {
    icon: Zap,
    title: "Less busywork",
    description:
      "Keep priorities, deadlines, and next steps easy to find.",
    color: "text-orange-300 bg-orange-500/10 ring-orange-400/20",
  },
  {
    icon: ShieldCheck,
    title: "Built with care",
    description:
      "Use protected routes, secure authentication, and workspace-aware APIs.",
    color: "text-cyan-300 bg-cyan-500/10 ring-cyan-400/20",
  },
];

const tasks = [
  {
    category: "DESIGN",
    title: "Map onboarding journey",
    date: "Oct 20",
    status: "todo",
  },
  {
    category: "CONTENT",
    title: "Write launch checklist",
    date: "Oct 22",
    status: "todo",
  },
  {
    category: "DEVELOPMENT",
    title: "Build workspace UI",
    date: "Today",
    status: "progress",
  },
  {
    category: "PLANNING",
    title: "Define MVP scope",
    date: "Complete",
    status: "done",
  },
];

function Brand({ small = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/25">
        <Zap size={small ? 17 : 20} fill="currentColor" />
      </span>
      <span className="text-xl font-bold tracking-tight text-white">
        taskflow<span className="text-violet-400">.ai</span>
      </span>
    </Link>
  );
}

function PreviewTask({ task }) {
  const statusStyles = {
    todo: "bg-zinc-700",
    progress: "bg-violet-400",
    done: "bg-emerald-400",
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#15151b] p-3 transition hover:border-violet-400/30">
      <span className="text-[9px] font-bold tracking-wider text-violet-300">
        {task.category}
      </span>
      <p className="mt-2 text-xs font-medium leading-5 text-zinc-200">
        {task.title}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusStyles[task.status]}`}
          />
          {task.date}
        </span>
        {task.status === "progress" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
            A
          </span>
        )}
        {task.status === "done" && (
          <Check size={13} className="text-emerald-400" />
        )}
      </div>
    </div>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
      <div className="absolute -inset-8 rounded-[40px] bg-violet-600/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl shadow-black/50 sm:rounded-3xl">
        <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-3 sm:px-5">
          <div className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <i className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <i className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>

          <span className="text-[10px] text-zinc-500 sm:text-xs">
            taskflow.ai / workspace
          </span>

          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live preview
          </span>
        </div>

        <div className="grid grid-cols-[46px_minmax(0,1fr)] sm:grid-cols-[145px_minmax(0,1fr)]">
          <aside className="flex min-h-[340px] flex-col border-r border-white/[0.06] p-2 sm:p-4">
            <div className="mb-7 flex items-center justify-center gap-2 sm:justify-start">
              <Zap size={16} className="shrink-0 text-violet-400" />
              <span className="hidden text-xs font-bold sm:inline">
                taskflow
              </span>
            </div>

            {[
              { icon: Layers3, label: "Overview" },
              { icon: Code2, label: "Projects" },
              { icon: Check, label: "My tasks" },
              { icon: Users, label: "Team" },
            ].map(({ icon: Icon, label }, index) => (
              <div
                key={label}
                className={`mb-2 flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-[10px] sm:justify-start sm:text-xs ${
                  index === 0
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-500"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}

            <div className="mt-auto flex justify-center gap-2 rounded-lg bg-white/[0.03] p-2 text-violet-300 sm:justify-start">
              <Sparkles size={14} />
              <span className="hidden text-[10px] sm:inline">AI planner</span>
            </div>
          </aside>

          <div className="min-w-0 p-3 sm:p-5">
            <div className="mb-5">
              <span className="text-[9px] font-semibold tracking-[0.15em] text-zinc-500">
                YOUR WORKSPACE
              </span>
              <h3 className="mt-2 text-base font-semibold tracking-tight sm:text-xl">
                Your workspace,{" "}
                <span className="text-violet-400">in flow.</span>
              </h3>
              <p className="mt-1 text-[10px] text-zinc-500 sm:text-xs">
                A little progress goes a long way.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Total tasks", value: "24", note: "All projects" },
                { label: "In progress", value: "08", note: "Moving forward" },
                { label: "Completed", value: "16", note: "67% done" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 sm:p-3"
                >
                  <p className="truncate text-[9px] text-zinc-500 sm:text-[11px]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 hidden text-[9px] text-zinc-600 sm:block">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { title: "To do", tasks: tasks.slice(0, 2), color: "bg-zinc-500" },
                {
                  title: "In progress",
                  tasks: tasks.slice(2, 3),
                  color: "bg-violet-400",
                },
                {
                  title: "Done",
                  tasks: tasks.slice(3, 4),
                  color: "bg-emerald-400",
                },
              ].map((column) => (
                <div key={column.title} className="min-w-0">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium text-zinc-300 sm:text-xs">
                    <span className={`h-2 w-2 rounded-full ${column.color}`} />
                    <span>{column.title}</span>
                    <span className="ml-auto text-zinc-600">
                      {column.tasks.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {column.tasks.map((task) => (
                      <PreviewTask key={task.title} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 right-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#19191f] p-3 shadow-xl sm:-right-5 sm:p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Bot size={21} />
        </span>
        <span>
          <span className="block text-xs font-semibold">AI made a plan</span>
          <span className="mt-1 block text-[10px] text-zinc-500">
            6 tasks ready to go
          </span>
        </span>
        <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check size={14} />
        </span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.06] bg-[#09090b]/90">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Brand />

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              How it works
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 sm:px-4 sm:text-sm"
            >
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="pointer-events-none absolute left-[-150px] top-10 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3.5 py-2 text-[10px] font-semibold tracking-[0.13em] text-violet-200 sm:text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                YOUR TEAM&apos;S CALMER WORKSPACE
              </div>

              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Make space for your{" "}
                <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  best work.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                Projects, people, and AI — finally working together. Spend less
                time managing work and more time making it matter.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-400"
                >
                  Start for free <ArrowRight size={17} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Explore features <ChevronRight size={16} />
                </a>
              </div>

              <div className="mt-9 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "bg-violet-500",
                    "bg-blue-500",
                    "bg-pink-500",
                    "bg-zinc-700",
                  ].map((color, index) => (
                    <span
                      key={index}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#09090b] ${color} text-xs font-semibold text-white`}
                    >
                      {["A", "M", "J", "+"][index]}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200">
                    Built for teams that care.
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Simple enough to start. Powerful enough to grow.
                  </p>
                </div>
              </div>
            </div>

            <WorkspacePreview />
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-white/[0.06] bg-white/[0.015] px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
            <span className="text-[10px] font-bold tracking-[0.18em] text-zinc-500">
              LESS CHAOS. MORE CLARITY.
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
              {[
                { icon: Check, text: "Focused workflows" },
                { icon: ShieldCheck, text: "Your workspace, your rules" },
                { icon: Sparkles, text: "AI when you need it" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-2 text-xs text-zinc-400"
                >
                  <Icon size={15} className="text-violet-300" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-xl text-center sm:mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] text-violet-300">
                EVERYTHING IN ITS PLACE
              </span>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Work shouldn&apos;t feel like{" "}
                <span className="text-zinc-500">more work.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-400">
                The tools your team needs, without the noise you don&apos;t.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.04] sm:p-7"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${color}`}
                  >
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-violet-300 opacity-0 transition group-hover:opacity-100">
                    Built for better work <ArrowUpRight size={14} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="how" className="scroll-mt-20 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-[#15121f] to-blue-500/[0.08] px-5 py-16 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[90px]" />

            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
                <Sparkles size={24} />
              </span>

              <span className="mt-7 block text-[10px] font-semibold tracking-[0.2em] text-violet-300 sm:text-xs">
                YOUR NEXT CHAPTER STARTS HERE
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Ready to find your flow?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                Bring your next idea to life, one clear step at a time.
              </p>
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-400"
              >
                Create your workspace <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Brand small />
          <p className="text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} TaskFlow AI. Made for meaningful work.
          </p>
          <div className="flex items-center gap-5 text-xs text-zinc-400">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <Link className="transition hover:text-white" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
