import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import QuickAddModal from "@/components/organisms/QuickAddModal"

const QuickAddButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl z-50 hover:shadow-2xl"
        size="lg"
      >
        <ApperIcon name="Plus" className="h-6 w-6" />
      </Button>
      
      <QuickAddModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default QuickAddButton