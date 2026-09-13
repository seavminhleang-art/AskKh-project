export default function Avatar({ name = "Admin", src, size = 32 }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (src) {
    return <img src={src} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {initials || "A"}
    </span>
  );
}
