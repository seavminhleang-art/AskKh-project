import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const isDev =
    import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== "false";

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
      {isDev && (
        <div className="fixed bottom-3 left-3 z-50 text-[14px] font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-md pointer-events-none">
          MOCK DATA
        </div>
      )}
    </div>
  );
}
