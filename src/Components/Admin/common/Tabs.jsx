export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 relative">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative px-4 py-2.5 text-lg font-medium transition-colors
            ${active === tab.value ? "text-brand-primary" : "text-gray-500 hover:text-gray-700"}`}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-primary rounded-full transition-all duration-200" />
          )}
        </button>
      ))}
    </div>
  );
}
