export function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isOverdue(task) {
  if (!task?.due_date || task.status === "completed") {
    return false;
  }

  return new Date(task.due_date) < new Date(new Date().toDateString());
}

export function statusLabel(status) {
  const labels = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return labels[status] || status;
}

export function priorityLabel(priority) {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return labels[priority] || priority;
}
