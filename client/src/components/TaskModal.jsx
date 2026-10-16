
import { useState } from "react";
import { X, CalendarDays, FolderKanban, Flag, AlignLeft } from "lucide-react";

export default function TaskModal({
  projects = [],
  onClose,
  onCreate,
  initialProject,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    projectId: initialProject || projects[0]?._id || "",
    dueDate: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.projectId) {
      setError("Please select a project first.");
      return;
    }

    setBusy(true);

    try {
      await onCreate({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
      });

      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to create task. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0c0c12] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10";

  const labelClass =
    "block text-sm font-medium text-zinc-300";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#13131a] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] px-5 py-5 sm:px-7">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-violet-400">
              TASK DETAILS
            </span>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Create a task
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a task and keep your project moving.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close modal"
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-5 px-5 py-6 sm:px-7">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Task title */}
          <label className={labelClass}>
            Task title
            <input
              className={inputClass}
              name="title"
              value={form.title}
              onChange={update}
              placeholder="e.g. Build onboarding flow"
              required
              maxLength={180}
              autoFocus
            />
          </label>

          {/* Description */}
          <label className={labelClass}>
            <span className="flex items-center gap-2">
              <AlignLeft size={15} className="text-zinc-500" />
              Description
              <span className="text-xs font-normal text-zinc-600">
                (optional)
              </span>
            </span>

            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              name="description"
              value={form.description}
              onChange={update}
              placeholder="What needs to be done?"
              rows={3}
            />
          </label>

          {/* Project and priority */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              <span className="flex items-center gap-2">
                <FolderKanban size={15} className="text-violet-400" />
                Project
              </span>

              <select
                className={inputClass}
                name="projectId"
                value={form.projectId}
                onChange={update}
                required
                disabled={projects.length === 0}
              >
                <option value="" disabled>
                  Select a project
                </option>

                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {projects.length === 0 && (
                <span className="mt-2 block text-xs text-amber-400">
                  Create a project before adding a task.
                </span>
              )}
            </label>

            <label className={labelClass}>
              <span className="flex items-center gap-2">
                <Flag size={15} className="text-amber-400" />
                Priority
              </span>

              <select
                className={inputClass}
                name="priority"
                value={form.priority}
                onChange={update}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
            </label>
          </div>

          {/* Due date */}
          <label className={labelClass}>
            <span className="flex items-center gap-2">
              <CalendarDays size={15} className="text-blue-400" />
              Due date
              <span className="text-xs font-normal text-zinc-600">
                (optional)
              </span>
            </span>

            <input
              className={inputClass}
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={update}
            />
          </label>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-white/[0.015] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy || projects.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating...
              </>
            ) : (
              "Create task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
