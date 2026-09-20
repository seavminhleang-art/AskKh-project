import { useDispatch, useSelector } from "react-redux";
import { setTheme, setDensity, toggleSidebar } from "@/redux/slices/uiSlice";
import Card from "@/Components/Admin/common/Card";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];
const densities = ["comfortable", "compact"];

export default function AppearancePanel() {
  const dispatch = useDispatch();
  const { theme, density, sidebarCollapsed } = useSelector((s) => s.ui);

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Appearance & Layout</h3>
      <p className="text-lg text-gray-500 mb-5">
        Personalize how the admin dashboard looks for you. Saved to this device.
      </p>

      <p className="text-lg font-medium text-gray-700 mb-2">Theme</p>
      <div className="flex gap-2 mb-5">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => dispatch(setTheme(value))}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border text-lg transition-colors
              ${theme === value ? "border-brand-primary bg-brand-primary-light text-brand-primary" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <p className="text-lg font-medium text-gray-700 mb-2">Sidebar</p>
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-5">
        <span className="text-lg text-gray-600">Collapsed by default</span>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`w-10 h-5.5 rounded-full transition-colors relative ${sidebarCollapsed ? "bg-brand-primary" : "bg-gray-200"}`}
          style={{ height: 22 }}
        >
          <span
            className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${sidebarCollapsed ? "translate-x-5" : "translate-x-0.5"}`}
            style={{ width: 18, height: 18 }}
          />
        </button>
      </div>

      <p className="text-lg font-medium text-gray-700 mb-2">Table Density</p>
      <div className="flex gap-2">
        {densities.map((d) => (
          <button
            key={d}
            onClick={() => dispatch(setDensity(d))}
            className={`px-4 py-2 rounded-lg text-lg capitalize border transition-colors
              ${density === d ? "border-brand-primary bg-brand-primary-light text-brand-primary" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            {d}
          </button>
        ))}
      </div>
    </Card>
  );
}
