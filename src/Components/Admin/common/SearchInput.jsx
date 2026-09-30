import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-base border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary
          transition-colors placeholder:text-gray-400"
      />
    </div>
  );
}
