export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl 
        transition-shadow duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
