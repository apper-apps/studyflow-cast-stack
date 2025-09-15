import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder:text-gray-400",
        error && "border-error focus:ring-error",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input