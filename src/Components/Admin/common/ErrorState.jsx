import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  message = "Unable to load data",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-brand-secondary-light flex items-center justify-center text-brand-secondary mb-3">
        <AlertTriangle size={22} />
      </div>
      <p className="text-base font-medium text-gray-700">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-3"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
