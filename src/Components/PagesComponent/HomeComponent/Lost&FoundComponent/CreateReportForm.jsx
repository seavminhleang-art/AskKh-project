import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCommunityAuth } from "@/features/lostFound/useCommunityAuth";
import { Link } from "react-router-dom";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "@/features/workspace/workspaceApi";
import { rows, message } from "@/features/workspace/workspaceModel";

export default function CreateReportForm({ onCancel, darkMode }) {
  const { t } = useTranslation();
  const authenticated = useCommunityAuth();
  const categories = useWorkspaceDataQuery({ resource: "categories" });
  const locations = useWorkspaceDataQuery({ resource: "locations" });
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("lost");
  const input =
    "block w-full rounded-xl border border-gray-400/30 p-3 mt-2 bg-transparent";
  async function submit(event) {
    event.preventDefault();
    if (state.isLoading) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim();
    const description = form.get("description").trim();
    const location = form.get("freeTextLocation").trim();
    if (!title || !description || (!location && !form.get("locationId"))) {
      setError("Enter a title, description, and location.");
      return;
    }
    try {
      await save({
        resource: "reports",
        action: "create",
        body: {
          itemType: reportType,
          title,
          description,
          itemDate: form.get("itemDate"),
          categoryId: form.get("categoryId")
            ? Number(form.get("categoryId"))
            : null,
          locationId: form.get("locationId")
            ? Number(form.get("locationId"))
            : null,
          freeTextLocation: location || null,
          scope: form.get("scope"),
          hiddenDetail: form.get("hiddenDetail").trim() || null,
          photoUrl: form.get("photoUrl").trim() || null,
        },
      }).unwrap();
      onCancel();
    } catch (error) {
      setError(message(error));
    }
  }
  return (
    <main
      className={`max-w-4xl mx-auto rounded-3xl p-6 ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-900"}`}
    >
      <h1 className="text-4xl font-bold mb-6">{t("feedReportBtn")}</h1>
      {!authenticated ? (
        <div>
          <Link to="/login">Sign in to report an item</Link>
          <button onClick={onCancel} className="ml-4">
            {t("reportCancelBtn")}
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-5"
          aria-busy={state.isLoading}
        >
          <fieldset disabled={state.isLoading} className="space-y-5">
            <div className="flex gap-3">
              {["lost", "found"].map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={type === reportType}
                  onClick={() => setReportType(type)}
                  className={`rounded-xl px-6 py-2 ${type === reportType ? "bg-blue-600 text-white" : "border"}`}
                >
                  {t(
                    type === "lost"
                      ? "reportFormToggleLost"
                      : "reportFormToggleFound",
                  )}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="text-red-500">
                {error}
              </p>
            )}
            <label className="block">
              Item name
              <input className={input} name="title" required maxLength={300} />
            </label>
            <label className="block">
              {t("reportDescriptionLabel")}
              <textarea
                className={input}
                name="description"
                required
                rows={5}
              />
            </label>
            <div className="grid sm:grid-cols-2 gap-5">
              <label>
                Date
                <input className={input} type="date" name="itemDate" required />
              </label>
              <label>
                Scope
                <select className={input} name="scope">
                  <option value="istad">ISTAD</option>
                  <option value="public">Public</option>
                </select>
              </label>
              <label>
                Category
                <select
                  className={input}
                  name="categoryId"
                  disabled={categories.isLoading || categories.isError}
                >
                  <option value="">Uncategorized</option>
                  {rows(categories.data).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name || item.categoryName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Campus location
                <select
                  className={input}
                  name="locationId"
                  disabled={locations.isLoading || locations.isError}
                >
                  <option value="">Other location</option>
                  {rows(locations.data).map((item) => (
                    <option key={item.id} value={item.id}>
                      {[item.building, item.floor, item.room]
                        .filter(Boolean)
                        .join(", ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {[categories, locations].map(
              (query, index) =>
                query.isError && (
                  <p role="alert" key={index}>
                    {message(query.error)}{" "}
                    <button type="button" onClick={query.refetch}>
                      Retry
                    </button>
                  </p>
                ),
            )}
            <label className="block">
              Location details
              <input
                className={input}
                name="freeTextLocation"
                placeholder={t("reportLocationPlaceholder")}
              />
            </label>
            <label className="block">
              Private identifying detail
              <textarea
                className={input}
                name="hiddenDetail"
                rows={3}
                placeholder="A detail only the owner would know"
              />
            </label>
            <label className="block">
              Photo URL (optional)
              <input
                className={input}
                name="photoUrl"
                type="url"
                pattern="https?://.+"
                placeholder="https://…"
              />
            </label>
            <div className="flex gap-3">
              <button
                className="rounded-xl bg-blue-600 text-white px-6 py-3 disabled:opacity-50"
                disabled={state.isLoading}
              >
                {state.isLoading
                  ? "Publishing…"
                  : t(
                      reportType === "lost"
                        ? "reportFormSubmitLost"
                        : "reportFormSubmitFound",
                    )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border px-6 py-3"
              >
                {t("reportCancelBtn")}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </main>
  );
}
