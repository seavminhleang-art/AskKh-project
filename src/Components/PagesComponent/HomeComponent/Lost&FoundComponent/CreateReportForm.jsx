import React, { useState } from "react";
import { 
  Package, 
  FileText, 
  Calendar, 
  Globe, 
  FolderTree, 
  MapPin, 
  MapPinCheck, 
  Lock, 
  Image as ImageIcon, 
  X, 
  AlertCircle, 
  Loader2, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

// Mocking i18n and workspace hooks for the standalone interactive preview
const useTranslation = () => ({
  t: (key) => {
    const translations = {
      feedReportBtn: "Create Report",
      reportCancelBtn: "Cancel",
      reportFormToggleLost: "Lost Item",
      reportFormToggleFound: "Found Item",
      reportDescriptionLabel: "Description",
      reportLocationPlaceholder: "e.g., Near the main library entrance, building B",
      reportFormSubmitLost: "Publish Lost Report",
      reportFormSubmitFound: "Publish Found Report"
    };
    return translations[key] || key;
  }
});

const useCommunityAuth = () => true;

const useWorkspaceDataQuery = ({ resource }) => {
  if (resource === "categories") {
    return {
      isLoading: false,
      isError: false,
      data: {
        rows: [
          { id: 1, name: "Electronics & Gadgets" },
          { id: 2, name: "Wallets & Purses" },
          { id: 3, name: "Keys & ID Cards" },
          { id: 4, name: "Books & Notes" },
          { id: 5, name: "Clothing & Accessories" }
        ]
      },
      refetch: () => {}
    };
  }
  if (resource === "locations") {
    return {
      isLoading: false,
      isError: false,
      data: {
        rows: [
          { id: 101, building: "Science Block", floor: "Floor 2", room: "Lab 204" },
          { id: 102, building: "Main Hall", floor: "Floor 1", room: "Auditorium" },
          { id: 103, building: "Library", floor: "Floor 3", room: "Reading Room" },
          { id: 104, building: "Student Center", floor: "Ground", room: "Cafeteria" }
        ]
      },
      refetch: () => {}
    };
  }
  return { isLoading: false, isError: false, data: { rows: [] }, refetch: () => {} };
};

const useWorkspaceSaveMutation = () => {
  const [loading, setLoading] = useState(false);
  const saveMutation = async ({ body }) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    return true;
  };
  return [saveMutation, { isLoading: loading }];
};

const rows = (data) => data?.rows || [];
const message = (err) => err?.message || "An unexpected error occurred.";

export default function CreateReportForm({ onCancel = () => {}, darkMode = false }) {
  const { t } = useTranslation();
  const authenticated = useCommunityAuth();
  const categories = useWorkspaceDataQuery({ resource: "categories" });
  const locations = useWorkspaceDataQuery({ resource: "locations" });
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("lost");

  const input =
    "block w-full rounded-xl border border-gray-300/60 dark:border-zinc-700/80 px-4 py-3 pl-11 mt-2 bg-white/50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm text-sm";
  
  const selectStyle =
    "block w-full rounded-xl border border-gray-300/60 dark:border-zinc-700/80 px-4 py-3 pl-11 mt-2 bg-white/50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm text-sm appearance-none cursor-pointer";

  async function submit(event) {
    event.preventDefault();
    if (state.isLoading) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim();
    const description = form.get("description").trim();
    const location = form.get("freeTextLocation").trim();
    if (!title || !description || (!location && !form.get("locationId"))) {
      setError("Please enter a title, description, and at least one location detail.");
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
      className={`max-w-3xl mx-auto rounded-3xl shadow-2xl border backdrop-blur-xl p-6 sm:p-10 transition-all duration-300 ${
        darkMode 
          ? "bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-indigo-950/20" 
          : "bg-white/90 border-gray-100 text-gray-900 shadow-xl"
      }`}
    >
      {/* Header section with icon & close action */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("feedReportBtn")}</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
              Help reunite lost items with their rightful owners quickly.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
          aria-label={t("reportCancelBtn")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!authenticated ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/30">
          <ShieldCheck className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">You need to be signed in to submit a lost or found report.</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 shadow-lg shadow-indigo-600/20 transition"
            >
              Sign in to report an item
            </Link>
            <button 
              onClick={onCancel} 
              className="rounded-xl border border-gray-300 dark:border-zinc-700 px-6 py-2.5 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              {t("reportCancelBtn")}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-6"
          aria-busy={state.isLoading}
        >
          <fieldset disabled={state.isLoading} className="space-y-6">
            
            {/* Lost / Found Toggle Switch */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                Report Status
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-gray-100/80 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60">
                {["lost", "found"].map((type) => {
                  const isActive = type === reportType;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setReportType(type)}
                      className={`flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all duration-200 ${
                        isActive 
                          ? type === "lost" 
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/25" 
                            : "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                          : "text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {type === "lost" ? <Package className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                      {t(
                        type === "lost"
                          ? "reportFormToggleLost"
                          : "reportFormToggleFound"
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div role="alert" className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Item Name */}
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Item name <span className="text-rose-500">*</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                  <Package className="w-4 h-4 mt-2" />
                </div>
                <input 
                  className={input} 
                  name="title" 
                  required 
                  maxLength={300} 
                  placeholder="e.g., MacBook Pro 14-inch Space Gray"
                />
              </div>
            </label>

            {/* Description */}
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              {t("reportDescriptionLabel")} <span className="text-rose-500">*</span>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400 dark:text-zinc-500">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  className={`${input} pl-11 pt-3`}
                  name="description"
                  required
                  rows={4}
                  placeholder="Provide detailed description including brand, color, stickers, or unique marks..."
                />
              </div>
            </label>

            {/* Grid for Date, Scope, Category, Location */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Date <span className="text-rose-500">*</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <Calendar className="w-4 h-4 mt-2" />
                  </div>
                  <input className={input} type="date" name="itemDate" required />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Scope
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <Globe className="w-4 h-4 mt-2" />
                  </div>
                  <select className={selectStyle} name="scope">
                    <option value="istad">ISTAD Campus</option>
                    <option value="public">Public Community</option>
                  </select>
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Category
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <FolderTree className="w-4 h-4 mt-2" />
                  </div>
                  <select
                    className={selectStyle}
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
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Campus location
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <MapPin className="w-4 h-4 mt-2" />
                  </div>
                  <select
                    className={selectStyle}
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
                </div>
              </label>
            </div>

            {/* Query error handling */}
            {[categories, locations].map(
              (query, index) =>
                query.isError && (
                  <div role="alert" key={index} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-900/50">
                    <span>{message(query.error)}</span>
                    <button 
                      type="button" 
                      onClick={query.refxl || query.refetch}
                      className="px-3 py-1 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition"
                    >
                      Retry
                    </button>
                  </div>
                ),
            )}

            {/* Location details (free text) */}
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Location details
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                  <MapPinCheck className="w-4 h-4 mt-2" />
                </div>
                <input
                  className={input}
                  name="freeTextLocation"
                  placeholder={t("reportLocationPlaceholder")}
                />
              </div>
            </label>

            {/* Private identifying detail */}
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Private identifying detail
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400 dark:text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <textarea
                  className={`${input} pl-11 pt-3`}
                  name="hiddenDetail"
                  rows={3}
                  placeholder="A detail only the owner would know (e.g., serial number, wallpaper, contents)"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 mt-1 block">
                Hidden from public view to verify rightful ownership during claims.
              </span>
            </label>

            {/* Photo URL */}
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Photo URL (optional)
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                  <ImageIcon className="w-4 h-4 mt-2" />
                </div>
                <input
                  className={input}
                  name="photoUrl"
                  type="url"
                  pattern="https?://.+"
                  placeholder="https://example.com/item-photo.jpg"
                />
              </div>
            </label>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/60 dark:border-zinc-800">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all cursor-pointer"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing…</span>
                  </>
                ) : (
                  <>
                    <span>
                      {t(
                        reportType === "lost"
                          ? "reportFormSubmitLost"
                          : "reportFormSubmitFound"
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 px-6 py-3.5 font-semibold text-gray-700 dark:text-zinc-300 transition cursor-pointer"
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

// Interactive Live Preview Wrapper Component
export function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-300 ${isDark ? "bg-zinc-950 text-white" : "bg-gradient-to-br from-indigo-50/50 via-gray-50 to-blue-50/50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CreateReportForm Showcase</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Toggle theme to inspect styling in light and dark mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${!isDark ? "bg-indigo-600 text-white shadow" : "bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"}`}
          >
            Light Mode
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${isDark ? "bg-indigo-600 text-white shadow" : "bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"}`}
          >
            Dark Mode
          </button>
        </div>
      </div>

      <CreateReportForm darkMode={isDark} onCancel={() => alert("Cancel action triggered!")} />
    </div>
  );
}