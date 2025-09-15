import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 display-font">StudyFlow</h1>
            <p className="text-sm text-gray-500">Academic Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 group",
                isActive 
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary" 
                  : "text-gray-600 hover:text-gray-900"
              )
            }
            onClick={() => isMobileOpen && onMobileClose()}
          >
            <ApperIcon 
              name={item.icon} 
              className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" 
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Student</p>
            <p className="text-xs text-gray-500">Academic Year 2024</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar