import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-card border border-gray-100 backdrop-blur-sm",
        hover && "hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card