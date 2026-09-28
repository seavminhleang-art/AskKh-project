import LostFoundReportRow from "./LostFoundReportRow";
import EditQuestionForm from "./EditQuestionForm";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import {
  rows,
  dateLabel,
  ownClaims,
  message,
} from "../../features/workspace/workspaceModel";
import { Heading, QueryState, Empty, Badge, QuickLinks } from "./WorkspaceUI";
import { notificationTarget } from "../../features/notifications/notificationTarget";
const titles = {
  questions: "My Questions",
  "lost-found": "My Lost & Found Reports",
  claims: "My Claims",
  matches: "Smart Matches",
  notifications: "Notifications",
};
function ReportRelated({ page, reportId, userId }) {
  const { w, locale } = useWorkspaceTranslation();
  const query = useWorkspaceDataQuery(
    {
      resource: page,
      id: reportId,
    },
    {
      skip: !reportId,
    },
  );
  if (!reportId)
    return (
      <Empty>
        {w("Select a report to view")} {page}.
      </Empty>
    );
  const items = rows(query.data);
  async function update(action, item) {
    setActionError("");
    try {
      await save({ resource: page, action, id: item.id }).unwrap();
      if (action === "approve") {
        toast.success(w("Claim approved successfully."));
      } else {
        toast.info(w("Claim rejected."));
      }
    } catch (error) {
      const errMsg = message(error);
      setActionError(errMsg);
      toast.error(errMsg);
    }
  }
  async function updateMatch(item, status) {
    setActionError("");
    try {
      await save({ resource: "matches", action: "update-status", id: item.id, body: { status } }).unwrap();
      toast.success(w("Match updated."));
    } catch (error) {
      const errMsg = message(error);
      setActionError(errMsg);
      toast.error(errMsg);
    }
  }
  return (
    <QueryState query={query} unavailableMessage={page === "matches" ? "Match Center is not available yet." : undefined}>
      {!items.length ? (
        <Empty>
          {w("No")}
          {page === "claims" ? w("claims from your account") : w("matches")}
          {w("for this report.")}
        </Empty>
      ) : (
        items.map((item) => (
          <article className="uw-row" key={item.id}>
            <div>
              <h2>
                {page === "claims"
                  ? w("Claim #{{value0}}", {
                      value0: item.id,
                    })
                  : w("Match #{{value0}}", {
                      value0: item.id,
                    })}
              </h2>
              <p>
                {page === "claims"
                  ? w("Submitted {{value0}}", {
                      value0: dateLabel(item.createdAt, locale),
                    })
                  : w("Lost report #{{value0}} · Found report #{{value1}}", {
                      value0: item.lostItemId,
                      value1: item.foundItemId,
                    })}
              </p>
              {page === "claims" && (
                <>
                  <p>
                    {w("Finder confirmation:")}{" "}
                    {item.confirmedByFinder ? w("Confirmed") : w("Pending")}
                    {w(" · Your confirmation:")}{" "}
                    {item.confirmedByClaimant ? w("Confirmed") : w("Pending")}
                  </p>
                  {(item.describedHiddenDetail || item.proofDescription) && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-base text-slate-700 dark:text-slate-300">
                      <strong>{w("Ownership proof:")}</strong>{" "}
                      {item.describedHiddenDetail || item.proofDescription}
                    </div>
                  )}
                </>
              )}
            </div>
            <Badge>{w(item.status)}</Badge>
          </article>
        ))
      )}
    </QueryState>
  );
}
function ClaimForm({ report, onClose }) {
  const { w } = useWorkspaceTranslation();
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await save({
        resource: "claims",
        action: "create",
        id: report.id,
        body: {
          describedHiddenDetail: new FormData(event.currentTarget)
            .get("detail")
            .trim(),
        },
      }).unwrap();
      setSaved(true);
    } catch (error) {
      setError(message(error));
    }
  }
  return (
    <section className="uw-card">
      <h2>
        {w("Claim:")} {report.title}
      </h2>
      {saved ? (
        <p role="status" className="uw-success mt-4">
          {w("Your claim was submitted. Track it under My Claims.")}
        </p>
      ) : (
        <form className="uw-form mt-4" onSubmit={submit}>
          <label>
            {w("Describe a detail that proves ownership")}
            <textarea name="detail" required minLength={5} rows={4} />
          </label>
          {error && (
            <p role="alert" className="uw-error">
              {w(error)}
            </p>
          )}
          <button className="uw-button" disabled={state.isLoading}>
            {state.isLoading ? w("Submitting\u2026") : w("Submit claim")}
          </button>
        </form>
      )}
      <button className="uw-button secondary mt-4" onClick={onClose}>
        {w("Close")}
      </button>
    </section>
  );
}

// ── Single question row with edit toggle and delete confirm ───────────────────
function QuestionRow({ item, profile, authUser, locale, w, page }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState("");
  const [save, deleteState] = useWorkspaceSaveMutation();
  const cancelDeleteRef = useRef(null);
  const deleteTriggerRef = useRef(null);

  const currentUserId = profile?.id ?? profile?.userId ?? authUser?.id ?? authUser?.userId;
  const currentUsername = profile?.username ?? authUser?.username ?? profile?.displayName ?? authUser?.displayName;
  const isOwn =
    page === "questions" ||
    (currentUserId != null &&
      [item.ownerId, item.userId, item.authorId, item.author?.id, item.user?.id, item.owner?.id].some(
        (id) => id != null && String(id) === String(currentUserId),
      )) ||
    (currentUsername != null &&
      [item.ownerDisplayName, item.author?.name, item.username].some(
        (name) => name && name.toLowerCase() === String(currentUsername).toLowerCase(),
      ));

  useEffect(() => {
    if (!confirmDelete) return undefined;
    cancelDeleteRef.current?.focus();
    return () => deleteTriggerRef.current?.focus();
  }, [confirmDelete]);

  async function removeQuestion() {
    setActionError("");
    try {
      await save({ resource: "posts", action: "delete", id: item.id }).unwrap();
      toast.success(w("Question deleted."));
      setConfirmDelete(false);
    } catch (failure) {
      setActionError(message(failure));
    }
  }

  return (
    <>
      <article className="uw-row">
        {item.photoUrl && (
          <img src={item.photoUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
        )}
        <div>
          <h2>
            <Link to={`/dashboard/questions/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="line-clamp-2">{item.body || item.description}</p>
          <p className="mt-2">
            {item.ownerDisplayName}{" "}
            {dateLabel(item.creationDate || item.createdAt, locale)}
          </p>
          <div className="uw-toolbar mt-2">
            <span>
              {item.score ?? 0} {w("votes ·")}{" "}
              {item.viewCount ?? 0} {w("views")}
            </span>
            {item.tagResponses?.map((tag) => (
              <Badge key={tag.id}>{tag.tagName || tag.name}</Badge>
            ))}
          </div>
        </div>
        {isOwn && (
          <div className="uw-stack shrink-0">
            <div className="uw-actions">
              <Link to={`/dashboard/questions/${item.id}`} className="uw-button secondary">
                {w("View")}
              </Link>
              <button
                className="uw-button secondary"
                onClick={() => {
                  setEditing((v) => !v);
                  setActionError("");
                }}
                aria-expanded={editing}
              >
                <Pencil size={14} />
                {w("Edit")}
              </button>
              <button
                ref={deleteTriggerRef}
                className="uw-button secondary text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={() => {
                  setActionError("");
                  setConfirmDelete(true);
                }}
              >
                <Trash2 size={14} />
                {w("Delete")}
              </button>
            </div>
          </div>
        )}
      </article>
      {editing && (
        <EditQuestionForm
          item={item}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      )}
      {confirmDelete && (
        <div
          className="uw-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleteState.isLoading)
              setConfirmDelete(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !deleteState.isLoading)
              setConfirmDelete(false);
            if (event.key === "Tab") {
              event.preventDefault();
              const next =
                document.activeElement === cancelDeleteRef.current
                  ? event.currentTarget.querySelector("[data-confirm-delete]")
                  : cancelDeleteRef.current;
              next?.focus();
            }
          }}
        >
          <section
            className="uw-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${item.id}`}
            aria-describedby={`delete-description-${item.id}`}
          >
            <span className="uw-confirm-icon">
              <Trash2 size={21} />
            </span>
            <h2 id={`delete-title-${item.id}`}>{w("Delete this question?")}</h2>
            <p id={`delete-description-${item.id}`}>
              {w(
                "This action cannot be undone. The question will be permanently removed.",
              )}
            </p>
            {actionError && (
              <p className="uw-confirm-error" role="alert">
                {actionError}
              </p>
            )}
            <div className="uw-confirm-actions">
              <button
                ref={cancelDeleteRef}
                className="uw-button secondary"
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleteState.isLoading}
              >
                {w("Cancel")}
              </button>
              <button
                data-confirm-delete
                className="uw-button uw-confirm-delete"
                type="button"
                onClick={removeQuestion}
                disabled={deleteState.isLoading}
              >
                {deleteState.isLoading ? (
                  <>
                    <span className="uw-confirm-spinner" aria-hidden="true" />
                    {w("Deleting…")}
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    {w("Delete question")}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default function WorkspaceListPage({ page }) {
  const { w, locale } = useWorkspaceTranslation();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const setSearch = (value) =>
    setSearchParams(
      value
        ? {
            search: value,
          }
        : {},
    );
  const [filter, setFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(0);
  const [reportId, setReportId] = useState("");
  const [claim, setClaim] = useState(null);
  const [error, setError] = useState("");
  const resource =
    page === "questions"
      ? "my-posts"
      : page === "notifications"
        ? "notifications"
        : "my-reports";
  const query = useWorkspaceDataQuery({
    resource,
    page: pageNumber,
  });
  const profileQuery = useWorkspaceDataQuery({
    resource: "profile",
  });
  const profile = profileQuery.data?.data ?? profileQuery.data;
  const [save, state] = useWorkspaceSaveMutation();
  const all = rows(query.data);
  const currentUserId = profile?.id ?? profile?.userId ?? authUser?.id ?? authUser?.userId;
  const currentUsername = profile?.username ?? authUser?.username ?? profile?.displayName ?? authUser?.displayName;

  const items = all.filter((item) => {
    if (filter === "mine") {
      const matchId =
        currentUserId != null &&
        [
          item.ownerId,
          item.userId,
          item.authorId,
          item.author?.id,
          item.user?.id,
          item.owner?.id,
        ].some((id) => id != null && String(id) === String(currentUserId));
      const matchName =
        currentUsername != null &&
        [item.ownerDisplayName, item.author?.name, item.username].some(
          (name) => name && name.toLowerCase() === String(currentUsername).toLowerCase(),
        );
      if (!matchId && !matchName && page !== "questions") return false;
    }
    if (filter === "unread" && item.read) return false;
    return `${item.title || ""} ${item.body || item.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });
  async function mark(action, id) {
    setError("");
    try {
      await save({
        resource: "notifications",
        action,
        id,
      }).unwrap();
    } catch (error) {
      setError(message(error));
    }
  }
  async function openNotification(item) {
    if (!item.read) await mark('mark-read', item.id);

    // Try the smart URL translator first
    const target = notificationTarget(item);
    if (target) {
      navigate(target);
      return;
    }

    // Fall back to type-based routing
    const entityId =
      item.referenceId ??
      item.relatedId ??
      item.targetId ??
      item.entityId ??
      item.postId ??
      item.reportId ??
      item.claimId ??
      null;

    const type = String(item.type || '').toUpperCase();

    if (
      type === 'COMMENT_ON_POST' ||
      type === 'ANSWER_ON_POST' ||
      type === 'POST_VOTE' ||
      type.includes('COMMENT') ||
      type.includes('ANSWER')
    ) {
      navigate(entityId ? `/dashboard/questions/${entityId}` : '/dashboard/questions');
      return;
    }

    if (type.startsWith('LOST_FOUND_CLAIM') || type.includes('CLAIM')) {
      navigate('/dashboard/claims');
      return;
    }

    if (type === 'LOST_FOUND_MATCH' || type.includes('MATCH')) {
      navigate('/dashboard/matches');
      return;
    }

    navigate('/dashboard/notifications');
  }

  const related = page === "claims" || page === "matches";
  const totalPages = query.data?.totalPages ?? query.data?.data?.totalPages;
  return (
    <div className={`uw-page ${page === "lost-found" ? "uw-reports-page" : ""}`}>
      <Heading
        title={w(titles[page])}
        description={
          related
            ? w("Select a report to review its updates.")
            : page === "notifications"
              ? w(
                  "Stay updated on your questions, claims, and community activity.",
                )
              : w("Manage your own contributions and tasks.")
        }
      >
        {page === "questions" || page === "lost-found" ? (
          <Link className="uw-button" to={`/dashboard/${page}/new`}>
            {page === "questions" ? w("Ask a question") : w("Report an item")}
          </Link>
        ) : page === "notifications" ? (
          <div className="flex flex-wrap gap-2">
            <button
              className="uw-button secondary"
              disabled={query.isFetching}
              onClick={() => query.refetch()}
            >
              {query.isFetching ? w("Refreshing…") : w("Refresh")}
            </button>
            <button
              className="uw-button"
              disabled={state.isLoading || query.isLoading || query.isError}
              onClick={() => mark("read-all")}
            >
              {w("Mark all as read")}
            </button>
          </div>
        ) : null}
      </Heading>
      {error && (
        <p role="alert" className="uw-error">
          {w(error)}
        </p>
      )}
      {claim && (
        <ClaimForm
          key={claim.id}
          report={claim}
          onClose={() => setClaim(null)}
        />
      )}
      <div className="uw-columns">
        <section className="uw-card">
          <QueryState query={query} unavailableMessage={page === "matches" ? "Match Center is not available yet." : undefined}>
            {related ? (
              <>
                <label className="uw-form">
                  {w("Report")}
                  <select
                    aria-label={w("Report")}
                    value={reportId}
                    onChange={(event) => setReportId(event.target.value)}
                  >
                    <option value="">{w("Select a report")}</option>
                    {all.map((item) => (
                      <option key={item.id} value={item.id}>
                        #{item.id} · {item.title}
                      </option>
                    ))}
                  </select>
                </label>
                {page === "claims" ? (
                  <QueryState query={profileQuery}>
                    <ReportRelated
                      page={page}
                      reportId={reportId}
                      userId={profile?.id}
                    />
                  </QueryState>
                ) : (
                  <ReportRelated page={page} reportId={reportId} />
                )}
              </>
            ) : (
              <>
                <div className="uw-toolbar">
                  <input
                    aria-label={w("Search {{value0}}", {
                      value0: w(titles[page]),
                    })}
                    placeholder={w("Search\u2026")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <select
                    aria-label={w("Filter records")}
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option value="all">
                      {w(
                        page === "notifications" ? "All updates" : "My contributions",
                      )}
                    </option>
                    <option
                      value={page === "notifications" ? "unread" : "mine"}
                    >
                      {page === "notifications"
                        ? w("Unread")
                        : w("My contributions")}
                    </option>
                  </select>
                </div>
                {items.length === 0 && (
                  <Empty>{w("No results to show.")}</Empty>
                )}
                {items.map((item) => page === "lost-found" ? (
                  <LostFoundReportRow key={item.id} item={item} />
                ) : page === "questions" ? (
                  <QuestionRow
                    key={item.id}
                    item={item}
                    profile={profile}
                    authUser={authUser}
                    locale={locale}
                    w={w}
                    page={page}
                  />
                ) : (
                  <article className="uw-row" key={item.id}>
                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h2>{item.title}</h2>
                      <p className="line-clamp-2">
                        {item.body || item.description}
                      </p>
                      <p className="mt-2">
                        {item.ownerDisplayName ||
                          item.locationLabel ||
                          item.freeTextLocation}{" "}
                        {dateLabel(item.creationDate || item.createdAt, locale)}
                      </p>
                    </div>
                    {page === "notifications" ? (
                      <div className="uw-stack">
                        <button
                          className="uw-button secondary"
                          disabled={item.read || state.isLoading}
                          onClick={() => mark("mark-read", item.id)}
                        >
                          {item.read ? w("Read") : w("Mark read")}
                        </button>
                        <button
                          className="uw-button"
                          onClick={() => openNotification(item)}
                        >
                          {w("Open")}
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))}
                {page === "notifications" && (
                  <div className="uw-actions mt-5">
                    <button
                      className="uw-button secondary"
                      disabled={pageNumber === 0 || query.isFetching}
                      onClick={() => setPageNumber((value) => value - 1)}
                    >
                      {w("Previous")}
                    </button>
                    <span>
                      {w("Page")} {pageNumber + 1}
                    </span>
                    <button
                      className="uw-button secondary"
                      disabled={
                        query.isFetching ||
                        (totalPages != null
                          ? pageNumber + 1 >= totalPages
                          : all.length < 20)
                      }
                      onClick={() => setPageNumber((value) => value + 1)}
                    >
                      {w("Next")}
                    </button>
                  </div>
                )}
              </>
            )}
          </QueryState>
        </section>
        <div className="uw-stack">
          <QuickLinks />
          <aside className="uw-card">
            <h2>
              {page === "claims"
                ? w("Ownership verification")
                : w("Community tips")}
            </h2>
            <p className="uw-muted mt-3">
              {page === "claims"
                ? w(
                    "Describe identifying details when submitting a claim. The finder reviews your request before approving it.",
                  )
                : w(
                    "Be specific, be respectful, and share enough detail for others to help.",
                  )}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
