import { useEffect, useRef, useState } from "react";

export default function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-30 mt-2 min-w-[10rem] bg-white border border-gray-100 rounded-lg shadow-lg py-1
            animate-scale-in origin-top-${align === "right" ? "right" : "left"} ${align === "right" ? "right-0" : "left-0"}`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, danger, ...props }) {
  return (
    <button
      className={`w-full flex items-center gap-2 px-3.5 py-2 text-base text-left transition-colors
        ${danger ? "text-brand-secondary hover:bg-brand-secondary-light" : "text-gray-700 hover:bg-gray-50"}`}
      {...props}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
