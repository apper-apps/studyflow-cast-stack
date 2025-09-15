import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="lg:hidden flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 display-font">StudyFlow</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <p className="text-sm text-gray-600">Welcome back!</p>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header