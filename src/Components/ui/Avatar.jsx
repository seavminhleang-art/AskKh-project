<<<<<<< HEAD
import React from "react";
import { cn } from "@/lib/utils";

export default function Avatar({ src, alt, name, size = "md", className }) {
=======
import React from 'react';
import { cn } from '@/lib/utils';

export default function Avatar({ src, alt, name, size = 'md', className }) {
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
  const [hasError, setHasError] = React.useState(!src);

  const initials = name
    ? name
<<<<<<< HEAD
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-3xl font-bold",
=======
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-bold',
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
  };

  return (
    <div
      className={cn(
<<<<<<< HEAD
        "relative rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white border border-slate-200 dark:border-slate-800 shadow-xs select-none",
        sizeClasses[size] || sizeClasses.md,
        className,
=======
        'relative rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white border border-slate-200 dark:border-slate-800 shadow-xs select-none',
        sizeClasses[size] || sizeClasses.md,
        className
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
<<<<<<< HEAD
          alt={alt || name || "Avatar"}
=======
          alt={alt || name || 'Avatar'}
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
