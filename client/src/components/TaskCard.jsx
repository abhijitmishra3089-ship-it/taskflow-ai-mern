
import {
  CalendarDays,
  GripVertical,
  UserRound,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

const priorityStyles = {
  high: "border-rose-400/20 bg-rose-500/10 text-rose-400",
  medium: "border-amber-400/20 bg-amber-500/10 text-amber-400",
  low: "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
};

export default function TaskCard({
  task,
  onMove,
  onDelete,
  draggable = true,
}) {
  const date = task.dueDate ? new Date(task.dueDate) : null;
  const priority = (task.priority || "medium").toLowerCase();

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.effectAllowed = "move";
    onMove?.(task);
  };

  return (
    <article
      draggable={draggable}
      onDragStart={handleDragStart}
      className="group relative cursor-grab rounded-2xl border border-white/[0.08] bg-[#14141b] p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/25 hover:bg-[#191922] hover:shadow-lg hover:shadow-black/20 active:cursor-grabbing"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[11px] font-semibold capitalize ${
            priorityStyles[priority] || priorityStyles.medium
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              priority === "high"
                ? "bg-rose-400"
                : priority === "low"
                  ? "bg-emerald-400"
                  : "bg-amber-400"
            }`}
          />
          {priority}
        </span>

        <div className="flex items-center gap-1">
          {draggable && (
            <span className="text-zinc-600 opacity-0 transition group-hover:opacity-100">
              <GripVertical size={16} />
            </span>
          )}

          {onDelete && (
            <button
              type="button"
              title="Delete task"
              aria-label={`Delete ${task.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Task content */}
      <h3 className="mt-4 break-words text-sm font-semibold leading-6 text-zinc-100 transition group-hover:text-violet-200">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-2 line-clamp-3 break-words text-xs leading-5 text-zinc-500">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500">
          {date && !Number.isNaN(date.getTime()) && (
            <>
              <CalendarDays size={13} className="shrink-0" />
              <span>
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center">
          {task.assignee?.name ? (
            <div
              title={task.assignee.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/25 to-blue-500/20 text-xs font-semibold text-violet-200 ring-2 ring-[#14141b]"
            >
              {task.assignee.name.trim().charAt(0).toUpperCase()}
            </div>
          ) : (
            <div
              title="Unassigned"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-500 ring-2 ring-[#14141b]"
            >
              <UserRound size={13} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
