import LostFoundReportRow from "./LostFoundReportRow";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import {
  rows,
  dateLabel,
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
        {w("Select a report to view")} {page}.
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
          {w("No")}
          {page === "claims" ? w("claims for this report") : w("matches")}
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
            </div>
            <div className="uw-stack">
              <Badge>{w(item.status)}</Badge>
              {page === "claims" && !["APPROVED", "REJECTED", "COMPLETED"].includes(String(item.status).toUpperCase()) && (
                <div className="uw-actions">
                  <button className="uw-button" disabled={saveState.isLoading} onClick={() => update("approve", item)}>{w("Approve")}</button>
                  <button className="uw-button secondary" disabled={saveState.isLoading} onClick={() => update("reject", item)}>{w("Reject")}</button>
                </div>
              )}
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
export default function WorkspaceListPage({ page }) {
  const { w, locale } = useWorkspaceTranslation();
  const navigate = useNavigate();
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
    if (!item.read) await mark("mark-read", item.id);
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
                      <h2>
                        {page === "questions" ? (
                          <Link to={`/dashboard/questions/${item.id}`}>
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h2>
                      <p className="line-clamp-2">
                        {item.body || item.description}
                      </p>
                      <p className="mt-2">
                        {item.ownerDisplayName ||
                          item.locationLabel ||
                          item.freeTextLocation}{" "}
                        {dateLabel(item.creationDate || item.createdAt, locale)}
                      </p>
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
