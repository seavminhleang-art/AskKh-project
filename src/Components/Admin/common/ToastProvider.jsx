import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const tones = {
  success: "text-green-600",
  error: "text-brand-secondary",
  info: "text-brand-primary",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className="animate-fade-slide bg-white border border-gray-100 shadow-lg rounded-lg p-3 flex items-start gap-2.5"
            >
              <Icon
                size={18}
                className={`${tones[t.type]} flex-shrink-0 mt-0.5`}
              />
              <p className="text-lg text-gray-700 flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-gray-300 hover:text-gray-500"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
