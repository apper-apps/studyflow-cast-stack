import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Select from "@/components/atoms/Select"
import AssignmentTable from "@/components/organisms/AssignmentTable"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [filteredAssignments, setFilteredAssignments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAssignments()
  }, [assignments, searchTerm, statusFilter, courseFilter])

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ])
      setAssignments(assignmentsData)
      setCourses(coursesData)
    } catch (error) {
      setError("Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }

  const filterAssignments = () => {
    let filtered = [...assignments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.status === statusFilter)
    }

    // Course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.courseId === courseFilter)
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    setFilteredAssignments(filtered)
  }

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await assignmentService.update(assignmentId, { status: newStatus })
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, status: newStatus } : a
      ))
      toast.success(`Assignment ${newStatus}!`)
    } catch (error) {
      toast.error("Failed to update assignment")
    }
  }

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return
    
    try {
      await assignmentService.delete(assignmentId)
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId))
      toast.success("Assignment deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete assignment")
    }
  }

  if (loading) return <Loading message="Loading assignments..." />
  if (error) return <Error message={error} onRetry={loadData} />

  if (assignments.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Empty 
          title="No assignments yet"
          description="Start by adding your first assignment to track your academic tasks."
          icon="FileText"
          actionText="Add Assignment"
        />
      </div>
    )
  }

  // Calculate stats
  const pendingCount = assignments.filter(a => a.status === "pending").length
  const completedCount = assignments.filter(a => a.status === "completed").length
  const overdueCount = assignments.filter(a => a.status === "overdue").length
  const completionRate = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 display-font">Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage your academic tasks</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{assignments.length}</p>
            </div>
            <ApperIcon name="FileText" className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <ApperIcon name="Clock" className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedCount}</p>
            </div>
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
            </div>
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <SearchBar
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80"
        />
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </Select>
          
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full sm:w-40"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id.toString()}>
                {course.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Assignments Table */}
      {filteredAssignments.length === 0 && (searchTerm || statusFilter !== "all" || courseFilter !== "all") ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <AssignmentTable
          assignments={filteredAssignments}
          courses={courses}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default Assignments