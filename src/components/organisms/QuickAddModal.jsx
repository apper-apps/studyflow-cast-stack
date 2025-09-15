import React, { useState } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import PrioritySelector from "@/components/molecules/PrioritySelector"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"

const QuickAddModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({
    title_c: "",
    course_id_c: "",
    due_date_c: "",
    priority_c: "medium",
    description_c: ""
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      loadCourses()
    }
  }, [isOpen])

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll()
      setCourses(data)
    } catch (error) {
      toast.error("Failed to load courses")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Assignment title is required")
      return
    }
    if (!formData.courseId) {
      toast.error("Course selection is required")
      return
    }
    if (!formData.dueDate) {
      toast.error("Due date is required")
      return
    }

    setLoading(true)
    try {
await assignmentService.create({
        ...formData,
        due_date_c: new Date(formData.due_date_c),
        status_c: "pending",
        grade_c: null,
        category_c: "Assignment"
      })
      toast.success("Assignment added successfully!")
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        description: ""
      })
      onClose()
    } catch (error) {
      toast.error("Failed to add assignment")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-md p-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="Plus" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 display-font">Quick Add Assignment</h2>
              <p className="text-sm text-gray-500">Add a new assignment quickly</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
label="Assignment Title"
            name="title_c"
            value={formData.title_c}
            onChange={handleInputChange}
            placeholder="Enter assignment title"
            required
          />

          <FormField
            label="Course"
            type="select"
            name="course_id_c"
            value={formData.course_id_c}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.name_c}
              </option>
            ))}
          </FormField>

          <FormField
            label="Due Date"
            type="date"
            name="due_date_c"
            value={formData.due_date_c}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level
            </label>
            <PrioritySelector
              value={formData.priority_c}
              onChange={handleInputChange}
              name="priority_c"
            />
          </div>

          <FormField
            label="Description (Optional)"
            name="description_c"
            value={formData.description_c}
            onChange={handleInputChange}
            placeholder="Brief description of the assignment"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              )}
              Add Assignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default QuickAddModal