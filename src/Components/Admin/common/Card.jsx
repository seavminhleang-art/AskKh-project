export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm
        transition-shadow duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
