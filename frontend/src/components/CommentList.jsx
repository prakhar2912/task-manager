import { formatDate } from "../utils/formatters";

export default function CommentList({ comments }) {
  return (
    <div className="space-y-3">
      {comments?.length ? (
        comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{comment.author?.full_name || comment.author?.username}</p>
              <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          No progress notes added yet.
        </div>
      )}
    </div>
  );
}
