import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading...", type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary animate-spin"></div>
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <ApperIcon name="GraduationCap" className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        <p className="text-sm text-gray-500">Please wait while we load your data</p>
      </div>
    </div>
  )
}

export default Loading