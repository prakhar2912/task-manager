import { useEffect, useState } from "react";

import API from "../api/client";
import CommentList from "../components/CommentList";
import TaskTable from "../components/TaskTable";
import { formatDate, isOverdue, priorityLabel, statusLabel } from "../utils/formatters";

export default function MemberDashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyTaskId, setBusyTaskId] = useState(null);

  async function fetchTasks() {
    try {
      const response = await API.get("/tasks/");
      setTasks(response.data);
      if (response.data.length && !selectedTask) {
        setSelectedTask(response.data[0]);
      } else if (selectedTask) {
        const latestSelected = response.data.find((task) => task.id === selectedTask.id);
        setSelectedTask(latestSelected || response.data[0] || null);
      }
    } catch {
      setError("Unable to load your assigned tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function updateStatus(taskId, status) {
    setBusyTaskId(taskId);
    setMessage("");
    setError("");

    try {
      await API.patch(`/tasks/${taskId}/`, { status });
      setMessage(`Task moved to ${statusLabel(status).toLowerCase()}.`);
      await fetchTasks();
    } catch {
      setError("Unable to update task status.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    if (!selectedTask || !comment.trim()) {
      return;
    }

    setBusyTaskId(selectedTask.id);
    setMessage("");
    setError("");

    try {
      await API.post(`/tasks/${selectedTask.id}/comments/`, { content: comment });
      setComment("");
      setMessage("Progress note added.");
      await fetchTasks();
    } catch {
      setError("Unable to add progress note.");
    } finally {
      setBusyTaskId(null);
    }
  }

  if (loading) {
    return <div className="panel p-6 text-sm text-slate-500">Loading your tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section>
        <TaskTable
          tasks={tasks}
          actionSlot={(task) => (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => setSelectedTask(task)}
              >
                View Details
              </button>
              {task.status === "pending" ? (
                <button
                  type="button"
                  className="btn-primary text-xs"
                  onClick={() => updateStatus(task.id, "in_progress")}
                  disabled={busyTaskId === task.id}
                >
                  Accept Task
                </button>
              ) : null}
              {task.status !== "completed" ? (
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => updateStatus(task.id, "completed")}
                  disabled={busyTaskId === task.id}
                >
                  Mark Complete
                </button>
              ) : null}
            </div>
          )}
        />
      </section>

      {selectedTask ? (
        <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
          <div className="panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedTask.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedTask.project_name || "General Task"} {isOverdue(selectedTask) ? "• Overdue" : ""}
                </p>
              </div>
              <button type="button" className="btn-secondary text-xs">
                {statusLabel(selectedTask.status)}
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Due Date</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{formatDate(selectedTask.due_date)}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Priority</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{priorityLabel(selectedTask.priority)}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Description</h4>
              <p className="mt-3 text-sm leading-7 text-slate-700">{selectedTask.description}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Instructions</h4>
              <p className="mt-3 text-sm leading-7 text-slate-700">{selectedTask.remarks || "No extra instructions added."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel p-6">
              <h3 className="text-lg font-semibold text-slate-900">Progress Notes</h3>
              <p className="mt-1 text-sm text-slate-500">Keep the admin updated with clear work progress.</p>

              <form className="mt-5 space-y-4" onSubmit={submitComment}>
                <textarea
                  className="field min-h-28"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Add work updates, blockers, or completion notes."
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={busyTaskId === selectedTask.id || !comment.trim()}
                >
                  Add Note
                </button>
              </form>
            </div>

            <div className="panel p-6">
              <CommentList comments={selectedTask.comments} />
            </div>
          </div>
        </section>
      ) : (
        <div className="panel p-6 text-sm text-slate-500">No task selected.</div>
      )}
    </div>
  );
}
