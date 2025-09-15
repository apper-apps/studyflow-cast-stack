import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Dashboard from "@/components/pages/Dashboard";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="mr-4 lg:hidden"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 display-font">
            Academic Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your courses, assignments, and academic progress
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:block">
          <p className="text-sm text-gray-600">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
          Logout
        </Button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
          <ApperIcon name="User" className="h-4 w-4 text-white" />
</div>
      </div>
    </div>
  )
}

export default Header