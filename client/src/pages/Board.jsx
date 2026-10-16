import { useEffect, useState } from "react";
import { Plus, Search, SlidersHorizontal, LayoutGrid } from "lucide-react";
import api, { getErrorMessage } from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { createSocket } from "../services/socket";

const columns = [
  { id: "todo", label: "To do", color: "bg-slate-400" },
  { id: "progress", label: "In progress", color: "bg-blue-500" },
  { id: "review", label: "In review", color: "bg-amber-500" },
  { id: "done", label: "Completed", color: "bg-emerald-500" },
];

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const [t, p] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      setTasks(t.data.tasks || []);
      setProjects(p.data.projects || []);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    load();

    const socket = createSocket();

    if (socket) {
      socket.on("task:created", (task) => {
        setTasks((old) => [
          task,
          ...old.filter((item) => item._id !== task._id),
        ]);
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

  const create = async (form) => {
    try {
      const { data } = await api.post("/tasks", form);

      setTasks((old) => [
        data.task,
        ...old.filter((task) => task._id !== data.task._id),
      ]);

      setShow(false);
      setError("");
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
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

      setError("");
    } catch (e) {
      setTasks(previousTasks);
      setError(getErrorMessage(e));
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

  const visible = tasks.filter((task) => {
    const matchesProject =
      filter === "all" || task.project?._id === filter;

    const matchesSearch = `${task.title || ""} ${
      task.description || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesProject && matchesSearch;
  });

  return (
    <div className="min-h-full space-y-7 text-slate-100">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-violet-400">
            <LayoutGrid size={15} />
            YOUR WORK, ORGANIZED
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Task board<span className="text-violet-400">.</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Move tasks forward. Keep momentum going.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShow(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          New task
        </button>
      </div>

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
            className="shrink-0 font-semibold hover:text-white"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and project filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="relative sm:w-56 sm:shrink-0">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by project"
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {columns.map((column) => {
          const list = visible.filter(
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
              {/* Column heading */}
              <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 pb-4">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${column.color}`}
                />

                <h2 className="text-sm font-semibold text-slate-200">
                  {column.label}
                </h2>

                <span className="rounded-md border border-white/10 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                  {list.length}
                </span>

                <button
                  type="button"
                  onClick={() => setShow(true)}
                  className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                  aria-label={`Create task for ${column.label}`}
                  title="New task"
                >
                  <Plus size={17} />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex min-h-40 flex-col gap-3">
                {list.map((task) => (
                  <div key={task._id} className="min-w-0">
                    <TaskCard
                      task={task}
                      onDelete={remove}
                    />
                  </div>
                ))}

                {list.length === 0 && (
                  <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                      <Plus size={17} />
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                      No tasks here yet
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Tasks will appear here
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Create task modal */}
      {show && (
        <TaskModal
          projects={projects}
          onClose={() => setShow(false)}
          onCreate={create}
        />
      )}
    </div>
  );
}