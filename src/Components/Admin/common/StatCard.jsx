import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return typeof target === "number" ? value : target;
}

export default function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  direction,
  supportingText,
}) {
  const animated = useCountUp(typeof value === "number" ? value : null);
  const displayValue =
    typeof value === "number" ? animated.toLocaleString() : value;

  return (
    <Card className="p-5 animate-fade-slide">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base text-gray-500">{title}</p>
          <p className="mt-1.5 text-5xl font-semibold text-gray-900">
            {displayValue}
          </p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-brand-primary-light flex items-center justify-center text-brand-primary">
            <Icon size={20} />
          </div>
        )}
      </div>
      {(trend !== undefined || supportingText) && (
        <div className="mt-3 flex items-center gap-1.5 text-base">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${direction === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {direction === "up" ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(trend)}%
            </span>
          )}
          {supportingText && (
            <span className="text-gray-400">{supportingText}</span>
          )}
        </div>
      )}
    </Card>
  );
}
