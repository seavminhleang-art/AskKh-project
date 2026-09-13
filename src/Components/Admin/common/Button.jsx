const variants = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-dark',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  danger: 'bg-brand-secondary text-white hover:bg-red-700',
  ghost: 'text-gray-600 hover:bg-gray-100',
}

const sizes = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
}

export default function Button({
  as: As = 'button', variant = 'primary', size = 'md', icon: Icon,
  className = '', children, ...props
}) {
  return (
    <As
      className={`inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 active:scale-[0.97] disabled:opacity-50
        disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </As>
  )
}
