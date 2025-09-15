import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary", 
  change,
  trend,
  className 
}) => {
  const colorClasses = {
    primary: "text-primary bg-blue-50",
    success: "text-success bg-green-50", 
    warning: "text-warning bg-yellow-50",
    error: "text-error bg-red-50",
    secondary: "text-secondary bg-purple-50"
  }

  return (
    <Card className={cn("p-6 hover:shadow-lg transition-all duration-300", className)} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-1",
              trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-full",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard