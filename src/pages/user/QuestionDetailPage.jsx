import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import {
  rows,
  dateLabel,
  message,
} from "../../features/workspace/workspaceModel";
import { Heading, QueryState, Empty, Badge } from "./WorkspaceUI";
export default function QuestionDetailPage() {
  const { w, locale } = useWorkspaceTranslation();
  const { id } = useParams();
  const query = useWorkspaceDataQuery({
    resource: "post",
    id,
  });
  const answers = useWorkspaceDataQuery({
    resource: "answers",
    id,
  });
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const post = query.data?.data ?? query.data;
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSuccess(false);
    const body = new FormData(form).get("answer").trim();
    if (body.length < 20) {
      setError("Please write at least 20 characters.");
      return;
    }
    try {
      await save({
        resource: "posts",
        action: "create",
        body: {
          title: "Community answer",
          body,
          postTypeId: 2,
          parentId: Number(id),
          tagIds: [],
          imageUrls: [],
        },
      }).unwrap();
      form.reset();
      setSuccess(true);
    } catch (error) {
      setError(message(error));
    }
  }
  return (
    <div className="uw-page">
      <Link to="/dashboard/questions" className="uw-muted">
        {w("\u2190 Back to questions")}
      </Link>
      <QueryState query={query}>
        {post && (
          <>
            <Heading
              title={post.title}
              description={`${post.ownerDisplayName || "Community member"} · ${dateLabel(post.creationDate, locale)}`}
            />
            <article className="uw-card uw-stack">
              <p className="whitespace-pre-wrap" style={{ fontSize: "18px", lineHeight: 1.6 }}>{post.body}</p>
              {post.codeSnippet && (
                <pre className="overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                  <code>{post.codeSnippet}</code>
                </pre>
              )}
              {post.imageUrls?.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt={w("Question attachment")}
                  className="max-h-96 max-w-full rounded-lg object-contain"
                />
              ))}
              <div className="uw-toolbar">
                {post.tagResponses?.map((tag) => (
                  <Badge key={tag.id}>{tag.tagName}</Badge>
                ))}
                <span className="uw-muted">
                  {post.score ?? 0} {w("votes \xB7")} {post.viewCount ?? 0}
                  {w("views")}
                </span>
              </div>
              {post.comments?.length > 0 && (
                <section>
                  <h2>{w("Comments")}</h2>
                  {post.comments.map((comment) => (
                    <div className="uw-row" key={comment.id}>
                      <div>
                        <p>{comment.text}</p>
                        <p>
                          {comment.userDisplayName} ·{" "}
                          {dateLabel(comment.creationDate, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </article>
          </>
        )}
      </QueryState>
      <section className="uw-card">
        <h2>{w("Answers")}</h2>
        <QueryState query={answers}>
          {rows(answers.data).length === 0 ? (
            <Empty>{w("Be the first to help with an answer.")}</Empty>
          ) : (
            rows(answers.data).map((answer) => (
              <article className="uw-row" key={answer.id}>
                <div>
                  <p className="whitespace-pre-wrap">{answer.body}</p>
                  {answer.codeSnippet && (
                    <pre className="overflow-auto text-sm">
                      <code>{answer.codeSnippet}</code>
                    </pre>
                  )}
                  <p className="mt-3">
                    {answer.ownerDisplayName} ·{" "}
                    {dateLabel(answer.creationDate, locale)}
                  </p>
                </div>
              </article>
            ))
          )}
        </QueryState>
      </section>
      {post && !query.isError && (
        <form className="uw-card uw-form" onSubmit={submit}>
          <h2>{w("Your answer")}</h2>
          {error && (
            <p role="alert" className="uw-error">
              {w(error)}
            </p>
          )}
          {success && (
            <p role="status" className="uw-success">
              {w("Your answer was published.")}
            </p>
          )}
          <label>
            {w("Answer")}
            <textarea name="answer" rows={6} minLength={20} required />
          </label>
          <div className="uw-actions">
            <button className="uw-button" disabled={state.isLoading}>
              {state.isLoading ? w("Publishing\u2026") : w("Post answer")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
