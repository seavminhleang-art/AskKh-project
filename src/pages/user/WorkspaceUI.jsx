import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { Link } from "react-router-dom";
import { message } from "../../features/workspace/workspaceModel";
export function Heading({ title, description, children }) {
  const { w } = useWorkspaceTranslation();
  return (
    <header className="uw-heading">
      <div>
        <h1>{title}</h1>
        <p>{w(description)}</p>
      </div>
      {children}
    </header>
  );
}
export function QueryState({ query, children, unavailableMessage }) {
  const { w } = useWorkspaceTranslation();
  if (query.isLoading || query.isUninitialized)
    return (
      <div className="uw-card uw-empty" role="status">
        {w("Loading\u2026")}
      </div>
    );
  if (query.isError && query.error?.code === "FEATURE_UNAVAILABLE")
    return (
      <div className="uw-card uw-empty" role="status">
        <p>{w(unavailableMessage || message(query.error))}</p>
      </div>
    );
  if (query.isError)
    return (
      <div className="uw-card uw-empty" role="alert">
        <p>
          {w(
            query.error?.status === 403
              ? "Your account does not have permission for this action."
              : query.error?.status === 401
                ? "Please sign in to continue."
                : message(query.error),
          )}
        </p>
        <button className="uw-button" onClick={query.refetch}>
          {w("Try again")}
        </button>
      </div>
    );
  return children;
}
export function Empty({ children = "No records yet." }) {
  const { w } = useWorkspaceTranslation();
  return <p className="uw-empty">{w(children)}</p>;
}
export function Badge({ children }) {
  const { w } = useWorkspaceTranslation();
  return <span className="uw-badge">{children || w("Pending")}</span>;
}
export function QuickLinks() {
  const { w } = useWorkspaceTranslation();
  return (
    <aside className="uw-card">
      <h2>{w("Quick actions")}</h2>
      <div className="uw-links">
        <Link to="/dashboard/questions/new">{w("Ask a question")}</Link>
        <Link to="/dashboard/lost-found/new">{w("Report an item")}</Link>
        <Link to="/dashboard/claims">{w("Track a claim")}</Link>
        <Link to="/dashboard/profile">{w("Edit profile")}</Link>
      </div>
    </aside>
  );
}
