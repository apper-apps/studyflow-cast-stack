import React from "react"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formatDate, isOverdue } from "@/utils/dateUtils"

const AssignmentTable = ({ assignments, courses, onStatusChange, onDelete }) => {
  const getCourse = (courseId) => courses.find(c => c.Id === parseInt(courseId))

  const getStatusVariant = (assignment) => {
    if (assignment.status === "completed") return "completed"
    if (assignment.status === "overdue" || (assignment.status === "pending" && isOverdue(assignment.dueDate))) return "overdue"
    return "pending"
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignments.map((assignment) => {
              const course = getCourse(assignment.courseId)
              const statusVariant = getStatusVariant(assignment)
              
              return (
                <tr key={assignment.Id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{assignment.title}</div>
                      {assignment.description && (
                        <div className="text-sm text-gray-500 mt-1">{assignment.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {course && (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">{course.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${isOverdue(assignment.dueDate) && assignment.status !== "completed" ? "text-red-600 font-medium" : "text-gray-600"}`}>
                      {formatDate(assignment.dueDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={assignment.priority}>
                      {assignment.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant}>
                      {assignment.status === "completed" ? "Completed" : 
                       isOverdue(assignment.dueDate) ? "Overdue" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {assignment.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => onStatusChange(assignment.Id, "completed")}
                        >
                          <ApperIcon name="Check" className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(assignment.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {assignments.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">Start by adding your first assignment using the + button.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentTable