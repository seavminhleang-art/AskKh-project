export default function Avatar({ src, name, size = 32 }) {
  const initials = name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  if (src) {
    return (
      <img
        src={src} alt={name} width={size} height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center font-medium flex-shrink-0"
      style={{ width: size, height: size, fontSize: Math.max(14, size * 0.38) }}
    >
      {initials}
    </div>
  )
}
