import React, { useState } from "react"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import QuickAddButton from "@/components/molecules/QuickAddButton"

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      <QuickAddButton />
    </div>
  )
}

export default Layout