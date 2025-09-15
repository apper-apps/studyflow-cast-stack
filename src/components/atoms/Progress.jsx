import React from "react"
import { cn } from "@/utils/cn"

const Progress = React.forwardRef(({ 
  value = 0, 
  max = 100, 
  className, 
  color = "primary",
  size = "md",
  ...props 
}, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const colors = {
    primary: "bg-gradient-to-r from-primary to-secondary",
    success: "bg-gradient-to-r from-success to-green-600",
    warning: "bg-gradient-to-r from-warning to-yellow-600",
    error: "bg-gradient-to-r from-error to-red-600"
  }

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          colors[color]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})

Progress.displayName = "Progress"

export default Progress