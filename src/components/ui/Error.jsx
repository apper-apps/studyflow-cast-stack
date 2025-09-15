import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="h-10 w-10 text-red-600" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 display-font">Oops! Something went wrong</h3>
        <p className="text-gray-600 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-500">
          If the problem persists, please refresh the page or contact support.
        </p>
      </div>
    </div>
  )
}

export default Error