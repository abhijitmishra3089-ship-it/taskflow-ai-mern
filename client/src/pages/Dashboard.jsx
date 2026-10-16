import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import { createSocket } from "../services/socket";

const columns = [
  { id: "todo", label: "To do", color: "bg-slate-400" },
  { id: "progress", label: "In progress", color: "bg-blue-500" },
  { id: "review", label: "In review", color: "bg-amber-500" },
  { id: "done", label: "Completed", color: "bg-emerald-500" },
];

function StatCard({ title, value, description, icon: Icon, color, percent }) {
  const colors = {
    purple: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
    blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-slate-900 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-slate-400">{title}</span>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${colors[color]}`}
        >
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </div>

      <div className="mt-3 flex min-h-5 items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{description}</span>
        {percent !== undefined && (
          <span className="text-xs font-semibold text-emerald-400">
            {percent}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const load = async () => {
    try {
      setError("");

      const [taskResponse, projectResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      setTasks(taskResponse.data.tasks || []);
      setProjects(projectResponse.data.projects || []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const socket = createSocket();

    if (socket) {
      socket.on("task:created", (task) => {
        setTasks((old) =>
          old.some((item) => item._id === task._id)
            ? old
            : [task, ...old],
        );
      });

      socket.on("task:updated", (task) => {
        setTasks((old) =>
          old.map((item) => (item._id === task._id ? task : item)),
        );
      });

      socket.on("task:deleted", ({ _id }) => {
        setTasks((old) => old.filter((task) => task._id !== _id));
      });
    }

    return () => socket?.disconnect();
  }, []);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((task) => task.status === "done").length,
      progress: tasks.filter((task) => task.status === "progress").length,
      high: tasks.filter(
        (task) => task.priority === "high" && task.status !== "done",
      ).length,
    }),
    [tasks],
  );

  const completionRate = counts.total
    ? Math.round((counts.done / counts.total) * 100)
    : 0;

  const create = async (form) => {
    try {
      const { data } = await api.post("/tasks", form);

      setTasks((old) => [
        data.task,
        ...old.filter((task) => task._id !== data.task._id),
      ]);

      setShowModal(false);
      setError("");
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks((old) => old.filter((task) => task._id !== id));
      setError("");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const move = async (id, status) => {
    const previousTasks = tasks;

    setTasks((old) =>
      old.map((task) =>
        task._id === id ? { ...task, status } : task,
      ),
    );

    try {
      const { data } = await api.patch(`/tasks/${id}`, { status });

      setTasks((current) =>
        current.map((task) =>
          task._id === id ? data.task : task,
        ),
      );
    } catch (e) {
      setTasks(previousTasks);
      setError(getErrorMessage(e));
    }
  };

  return (
    <div className="min-h-full space-y-8 text-slate-100">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-violet-400">
            <Sparkles size={15} />
            YOUR WORKSPACE
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Your workspace,
            <br className="sm:hidden" />{" "}
            <span className="text-violet-400">in flow.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Here’s what’s happening across your projects today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          New task
        </button>
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="font-semibold hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total tasks"
          value={counts.total}
          description="Across your workspace"
          icon={Target}
          color="purple"
        />

        <StatCard
          title="In progress"
          value={counts.progress}
          description="Moving forward"
          icon={Clock3}
          color="blue"
        />

        <StatCard
          title="Completed"
          value={counts.done}
          description="Overall completion rate"
          icon={CheckCircle2}
          color="green"
          percent={completionRate}
        />

        <StatCard
          title="High priority"
          value={counts.high}
          description="Needs attention"
          icon={CircleDashed}
          color="orange"
        />
      </section>

      {/* Board heading */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Task board
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Your team's work at a glance
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/board")}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Open board <ArrowUpRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-sm text-slate-400">
            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            Loading your tasks...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {columns.map((column) => {
              const list = tasks.filter(
                (task) => task.status === column.id,
              );

              return (
                <section
                  key={column.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("taskId");
                    if (id) move(id, column.id);
                  }}
                  className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:p-4"
                >
                  <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 pb-4">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${column.color}`}
                    />

                    <h3 className="text-sm font-semibold text-slate-200">
                      {column.label}
                    </h3>

                    <span className="rounded-md border border-white/10 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {list.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                      aria-label={`Create task for ${column.label}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex min-h-32 flex-col gap-3">
                    {list.slice(0, 3).map((task) => (
                      <div key={task._id} className="min-w-0">
                        <TaskCard task={task} onDelete={remove} />
                      </div>
                    ))}

                    {list.length === 0 && (
                      <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-white/10 px-3 text-center text-xs text-slate-500">
                        Drop tasks here
                      </div>
                    )}

                    {list.length > 3 && (
                      <button
                        type="button"
                        onClick={() => navigate("/board")}
                        className="rounded-lg py-2 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                      >
                        + {list.length - 3} more tasks
                      </button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>

      {/* Projects and AI */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Recent projects
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Keep the big picture in view
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-5 py-9 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Target size={23} />
              </div>

              <h3 className="font-semibold text-slate-200">
                Your first project starts here
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Create a project to organize tasks and collaborate with your
                team.
              </p>

              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-500/40 hover:bg-slate-700"
              >
                Create project <Plus size={15} />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {projects.slice(0, 3).map((project) => (
                <button
                  type="button"
                  key={project._id}
                  onClick={() => navigate("/projects")}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-4 text-left transition hover:bg-white/[0.03]"
                >
                  <span
                    className="h-10 w-1.5 shrink-0 rounded-full bg-violet-500"
                    style={
                      project.color
                        ? { backgroundColor: project.color }
                        : undefined
                    }
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-200">
                      {project.name}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {project.description || "No description yet"}
                    </span>
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-slate-500"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI promo card */}
        <div className="relative isolate flex min-h-72 flex-col overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-950 via-violet-900 to-slate-950 p-6 sm:p-8 xl:col-span-2">
          <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-xs font-bold tracking-wider text-violet-200">
            <Sparkles size={14} />
            TASKFLOW AI
          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white">
            Big goal?
            <br />
            <span className="text-violet-300">Small steps.</span>
          </h2>

          <p className="mt-3 max-w-xs text-sm leading-6 text-violet-100/70">
            Turn a messy idea into a clear, actionable plan in seconds.
          </p>

          <button
            type="button"
            onClick={() => navigate("/ai")}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-950 transition hover:bg-violet-100 active:scale-[0.98]"
          >
            Plan with AI <ArrowRight size={16} />
          </button>

          <Bot
            size={100}
            strokeWidth={1}
            className="pointer-events-none absolute -bottom-3 -right-3 -z-10 text-violet-200/10"
          />
        </div>
      </section>

      {/* Create task modal */}
      {showModal && (
        <TaskModal
          projects={projects}
          onClose={() => setShowModal(false)}
          onCreate={create}
        />
      )}
    </div>
  );
}