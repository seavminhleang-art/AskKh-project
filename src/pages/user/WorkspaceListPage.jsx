import LostFoundReportRow from "./LostFoundReportRow";
import EditQuestionForm from "./EditQuestionForm";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import {
  rows,
  dateLabel,
  message,
  notificationClaimId,
  notificationReportId,
  isIncomingClaimNotification,
  isApprovedClaimNotification,
} from "../../features/workspace/workspaceModel";
import { Heading, QueryState, Empty, Badge, QuickLinks } from "./WorkspaceUI";
import { notificationTarget } from "../../features/notifications/notificationTarget";
import { Bell, MessageCircle, PackageSearch, Sparkles, CircleCheck, Pencil, Trash2 } from "lucide-react";

function notificationKind(item) {
  const type = String(item?.type || "").toUpperCase();
  if (type.includes("CLAIM")) return type.includes("APPROVED") ? "success" : "claim";
  if (type.includes("MATCH")) return "match";
  if (type.includes("COMMENT") || type.includes("ANSWER")) return "discussion";
  return "general";
}

function notificationDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(locale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function claimSubmittedDetail(claim) {
  const sources = [
    claim,
    claim?.data,
    claim?.claim,
    claim?.data?.claim,
    claim?.metadata,
    claim?.metadata?.claim,
    claim?.data?.metadata,
    claim?.data?.metadata?.claim,
  ];
  const fields = [
    "describedHiddenDetail",
    "describedHiddenDetails",
    "proofDescription",
    "claimDescription",
    "ownershipDetail",
    "details",
  ];
  for (const source of sources) {
    for (const field of fields) {
      const value = source?.[field];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return "";
}

function NotificationClaimDetails({ notification }) {
  const { w } = useWorkspaceTranslation();
  const [open, setOpen] = useState(false);
  const reportId = notificationReportId(notification);
  const claimId = notificationClaimId(notification);
  const directDetail = claimSubmittedDetail(notification) ||
    claimSubmittedDetail(notification?.metadata) ||
    claimSubmittedDetail(notification?.data?.metadata);
  const query = useWorkspaceDataQuery(
    { resource: "claims", id: reportId },
    { skip: !open || !reportId },
  );
  const claimRows = reportId && open && query.data ? rows(query.data) : [];
  const claim = claimRows.find((entry) => String(entry.id) === String(claimId)) ||
    (claimRows.length === 1 ? claimRows[0] : null);
  const submittedDetail = directDetail || claimSubmittedDetail(claim);

  return (
    <div className="uw-notification-evidence">
      <button type="button" className="uw-evidence-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {w(open ? "Hide submitted detail" : "View submitted ownership details")}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="uw-notification-evidence-panel">
          {query.isLoading && <p role="status">{w("Loading submitted detail…")}</p>}
          {query.isError && <p role="alert">{w(message(query.error))}</p>}
          {submittedDetail ? (
            <p className="uw-claim-reference">{submittedDetail}</p>
          ) : !query.isLoading && !query.isError ? (
            <p>{w(reportId ? "The claims response did not include the submitted ownership details." : "Open Review claims and select the found report to view the submitted detail.")}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
const titles = {
  questions: "My Questions",
  "lost-found": "My Lost & Found Reports",
  claims: "My Claims",
  matches: "Smart Matches",
  notifications: "Notifications",
};
function ReportRelated({ page, reportId }) {
  const { w, locale } = useWorkspaceTranslation();
  const [save, saveState] = useWorkspaceSaveMutation();
  const [actionError, setActionError] = useState("");
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
        {page === "claims"
          ? w("Choose a report above to review its claims and approve or reject requests.")
          : <>{w("Select a report to view")} {page}.</>}
      </Empty>
    );
  const items = rows(query.data);
  async function update(action, item) {
    setActionError("");
    try {
      await save({ resource: page, action, id: item.id }).unwrap();
    } catch (error) {
      setActionError(message(error));
    }
  }
  async function updateMatch(item, status) {
    setActionError("");
    try {
      await save({ resource: "matches", action: "update-status", id: item.id, body: { status } }).unwrap();
    } catch (error) {
      setActionError(message(error));
    }
  }
  return (
    <QueryState query={query} unavailableMessage={page === "matches" ? "Match Center is not available yet." : undefined}>
      {actionError && <p role="alert" className="uw-error">{w(actionError)}</p>}
      {!items.length ? (
        <Empty>
          {page === "claims"
            ? w("No claims for this report.")
            : w("No matches for this report.")}
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
                  : w("Lost report #{{value0}} \xB7 Found report #{{value1}}", {
                      value0: item.lostItemId,
                      value1: item.foundItemId,
                    })}
              </p>
              {page === "claims" && (
                <p>
                  {w("Finder confirmation:")}{" "}
                  {item.confirmedByFinder ? w("Confirmed") : w("Pending")}
                  {w("\xB7 Your confirmation:")}{" "}
                  {item.confirmedByClaimant ? w("Confirmed") : w("Pending")}
                </p>
              )}
              {page === "claims" && (
                <details className="uw-claim-evidence">
                  <summary>{w("View submitted ownership details")}</summary>
                  <div className="uw-claim-evidence-content">
                    <p><strong>{w("Claimant")}</strong> {item.claimantDisplayName || item.claimantName || (item.claimantUserId != null ? `#${item.claimantUserId}` : w("Not provided"))}</p>
                    <p><strong>{w("Submitted reference")}</strong></p>
                    <p className="uw-claim-reference">{item.describedHiddenDetail || item.proofDescription || item.claimDescription || item.details || w("The claims response did not include the submitted ownership details.")}</p>
                    {!(["APPROVED", "REJECTED", "COMPLETED"].includes(String(item.status).toUpperCase())) && (
                      <div className="uw-actions uw-claim-decision-actions">
                        <button className="uw-button uw-approve-button" disabled={saveState.isLoading} onClick={() => update("approve", item)}>{w("Approve")}</button>
                        <button className="uw-button secondary uw-reject-button" disabled={saveState.isLoading} onClick={() => update("reject", item)}>{w("Reject")}</button>
                        {saveState.isLoading && <span role="status" className="uw-muted">{w("Saving…")}</span>}
                      </div>
                    )}
                  </div>
                </details>
              )}
              {page === "claims" && String(item.status).toUpperCase() === "APPROVED" && (
                <Link
                  className="uw-button secondary uw-print-receipt-link"
                  to={`/dashboard/claims/receipt?reportId=${encodeURIComponent(reportId)}&claimId=${encodeURIComponent(item.id)}`}
                >
                  {w("View / print approval receipt")}
                </Link>
              )}
            </div>
            <div className="uw-stack">
              <Badge>{w(item.status)}</Badge>
              {page === "matches" && !["CONFIRMED", "REJECTED"].includes(String(item.status).toUpperCase()) && (
                <div className="uw-actions">
                  <button className="uw-button" disabled={saveState.isLoading} onClick={() => updateMatch(item, "CONFIRMED")}>{w("Confirm match")}</button>
                  <button className="uw-button secondary" disabled={saveState.isLoading} onClick={() => updateMatch(item, "REJECTED")}>{w("Reject match")}</button>
                </div>
              )}
            </div>
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
  const [claimDecisions, setClaimDecisions] = useState({});
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
  const items = all.filter((item) => {
    if (
      filter === "mine" &&
      (profile?.id == null ||
        String(item.ownerId ?? item.userId) !== String(profile.id))
    )
      return false;
    if (filter === "unread" && (item.read ?? item.isRead)) return false;
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
    if (!(item.read ?? item.isRead)) await mark("mark-read", item.id);
    navigate(notificationTarget(item) || "/dashboard/notifications");
  }
  const related = page === "claims" || page === "matches";
  const totalPages = query.data?.totalPages ?? query.data?.data?.totalPages;
  return (
    <div className={`uw-page ${page === "lost-found" ? "uw-reports-page" : ""}`}>
      <Heading
        title={w(titles[page])}
        description={
          related
            ? page === "claims"
              ? w("Choose one of your reports to review claims and approve or reject requests.")
              : w("Select a report to review its updates.")
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
        <section className={`uw-card ${page === "lost-found" ? "uw-reports-list" : ""} ${page === "notifications" ? "uw-notifications-card" : ""}`}>
          <QueryState query={query} unavailableMessage={page === "matches" ? "Match Center is not available yet." : undefined}>
            {page === "notifications" && (
              <div className="uw-notification-summary">
                <div>
                  <span className="uw-summary-icon"><Bell size={17} /></span>
                  <strong>{all.length}</strong>
                  <span>{w("Updates on this page")}</span>
                </div>
                <span className="uw-unread-count">
                  {all.filter((item) => !(item.read ?? item.isRead)).length} {w("unread")}
                </span>
              </div>
            )}
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
                        #{item.id} · {item.itemType ? `${w(item.itemType)} · ` : ""}{item.title}
                      </option>
                    ))}
                  </select>
                </label>
                {page === "claims" ? (
                  <QueryState query={profileQuery}>
                    <ReportRelated
                      page={page}
                      reportId={reportId}
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
                  <article
                    className={`uw-row ${page === "notifications" ? "uw-notification-row" : ""}`}
                    data-unread={page === "notifications" ? !(item.read ?? item.isRead) : undefined}
                    data-kind={page === "notifications" ? notificationKind(item) : undefined}
                    key={item.id}
                  >
                    {page === "notifications" && (
                      <span className="uw-notification-icon" aria-hidden="true">
                        {notificationKind(item) === "discussion" ? <MessageCircle size={19} />
                          : notificationKind(item) === "claim" ? <PackageSearch size={19} />
                            : notificationKind(item) === "match" ? <Sparkles size={19} />
                              : notificationKind(item) === "success" ? <CircleCheck size={19} />
                                : <Bell size={19} />}
                      </span>
                    )}
                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className={page === "notifications" ? "uw-notification-heading" : ""}>
                      <h2>
                        {page === "questions" ? (
                          <Link to={`/dashboard/questions/${item.id}`}>
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h2>
                      {page === "notifications" && !(item.read ?? item.isRead) && (
                        <span className="uw-new-indicator"><i />{w("New")}</span>
                      )}
                      </div>
                      <p className="line-clamp-2">
                        {item.body || item.description}
                      </p>
                      <p className={`mt-2 ${page === "notifications" ? "uw-notification-date" : ""}`}>
                        {page === "notifications"
                          ? notificationDate(item.createdAt, locale)
                          : <>{item.ownerDisplayName || item.locationLabel || item.freeTextLocation} {dateLabel(item.creationDate || item.createdAt, locale)}</>}
                      </p>
                      {page === "notifications" && isIncomingClaimNotification(item) && (
                        <NotificationClaimDetails notification={item} />
                      )}
                      {page === "notifications" && notificationClaimId(item) && (() => {
                        const claimId = notificationClaimId(item);
                        const decision = claimDecisions[item.id];
                        const claimStatus = decision || item.claimStatus || item.status;
                        const actionable = !decision && !["APPROVED", "REJECTED", "COMPLETED"].includes(String(claimStatus || "PENDING").toUpperCase());
                        return (
                          <div className="uw-claim-review">
                            <span className="uw-review-label">{w("Claim review")}</span>
                            {actionable ? (
                              <div className="uw-actions">
                                <button className="uw-button uw-approve-button" disabled={state.isLoading} onClick={async () => {
                                  setError("");
                                  try {
                                    await save({ resource: "claims", action: "approve", id: claimId }).unwrap();
                                    setClaimDecisions((current) => ({ ...current, [item.id]: "APPROVED" }));
                                  } catch (actionError) { setError(message(actionError)); }
                                }}>{w("Approve claim")}</button>
                                <button className="uw-button secondary uw-reject-button" disabled={state.isLoading} onClick={async () => {
                                  setError("");
                                  try {
                                    await save({ resource: "claims", action: "reject", id: claimId }).unwrap();
                                    setClaimDecisions((current) => ({ ...current, [item.id]: "REJECTED" }));
                                  } catch (actionError) { setError(message(actionError)); }
                                }}>{w("Reject")}</button>
                              </div>
                            ) : <Badge>{w(claimStatus || "Pending")}</Badge>}
                            {state.isLoading && <span className="uw-muted" role="status">{w("Saving…")}</span>}
                          </div>
                        );
                      })()}
                      {page === "questions" && (
                        <div className="uw-toolbar mt-2">
                          <span>
                            {item.score ?? 0} {w("votes \xB7")}{" "}
                            {item.viewCount ?? 0} {w("views")}
                          </span>
                          {item.tagResponses?.map((tag) => (
                            <Badge key={tag.id}>{tag.tagName}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {page === "notifications" ? (
                      <div className="uw-stack uw-notification-actions">
                        {isApprovedClaimNotification(item) &&
                          notificationClaimId(item) && notificationReportId(item) && (
                            <Link
                              className="uw-button"
                              to={`/dashboard/claims/receipt?reportId=${encodeURIComponent(notificationReportId(item))}&claimId=${encodeURIComponent(notificationClaimId(item))}`}
                            >
                              {w("View / print approval receipt")}
                            </Link>
                          )}
                        {isIncomingClaimNotification(item) && (
                          <Link className="uw-button secondary" to="/dashboard/claims">
                            {w("Review claims")}
                          </Link>
                        )}
                        <button
                          className="uw-button secondary"
                          disabled={(item.read ?? item.isRead) || state.isLoading}
                          onClick={() => mark("mark-read", item.id)}
                        >
                          {(item.read ?? item.isRead) ? w("Read") : w("Mark read")}
                        </button>
                        <button
                          className="uw-button"
                          onClick={() => openNotification(item)}
                        >
                          {w("Open")}
                        </button>
                      </div>
                    ) : page === "lost-found" ? (
                      <div className="uw-stack">
                        <Badge>{w(item.status || item.itemType)}</Badge>
                        {item.itemType?.toLowerCase() === "found" &&
                          profile?.id != null &&
                          String(item.userId) !== String(profile.id) && (
                            <button
                              className="uw-button secondary"
                              onClick={() => setClaim(item)}
                            >
                              {w("Claim item")}
                            </button>
                          )}
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
