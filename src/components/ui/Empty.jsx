import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  icon = "Package", 
  actionText = "Add Item",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 display-font">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {onAction && (
        <Button onClick={onAction} className="mt-4">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Use the + button to quickly add new items to your academic tracker.
        </p>
      </div>
    </div>
  )
}

export default Empty