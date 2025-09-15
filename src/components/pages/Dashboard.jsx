import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import StatCard from "@/components/molecules/StatCard"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { calculateGPA, calculateCourseGrade, gradeToLetter } from "@/utils/gradeUtils"
import { formatDate, isOverdue, getDaysUntilDue } from "@/utils/dateUtils"

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError("")
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ])
      setCourses(coursesData)
      setAssignments(assignmentsData)
    } catch (error) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await assignmentService.update(assignmentId, { status: "completed" })
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, status: "completed" } : a
      ))
      toast.success("Assignment marked as completed!")
    } catch (error) {
      toast.error("Failed to update assignment")
    }
  }

  if (loading) return <Loading message="Loading your dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  
  // Calculate statistics
  const currentGPA = calculateGPA(courses)
  const totalAssignments = assignments.length
  const completedAssignments = assignments.filter(a => a.status === "completed").length
  const pendingAssignments = assignments.filter(a => a.status === "pending").length
  const overdueAssignments = assignments.filter(a => isOverdue(a.dueDate) && a.status !== "completed").length
  
  // Today's assignments
  const todayAssignments = assignments.filter(a => {
    const daysUntil = getDaysUntilDue(a.dueDate)
    return daysUntil <= 0 && a.status !== "completed"
  })

  // Upcoming assignments (next 7 days)
  const upcomingAssignments = assignments
    .filter(a => {
      const daysUntil = getDaysUntilDue(a.dueDate)
      return daysUntil > 0 && daysUntil <= 7 && a.status !== "completed"
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  // Get course for assignment
  const getCourse = (courseId) => courses.find(c => c.Id === parseInt(courseId))

  if (courses.length === 0 && assignments.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Empty 
          title="Welcome to StudyFlow!"
          description="Start organizing your academic life by adding your first course or assignment."
          icon="GraduationCap"
          actionText="Get Started"
        />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 display-font mb-2">Dashboard</h1>
        <p className="text-gray-600">Your academic overview at a glance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={currentGPA.toFixed(2)}
          icon="Award"
          color={currentGPA >= 3.5 ? "success" : currentGPA >= 3.0 ? "primary" : currentGPA >= 2.5 ? "warning" : "error"}
        />
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon="BookOpen"
          color="primary"
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon="FileText"
          color={pendingAssignments > 5 ? "warning" : "success"}
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueAssignments}
          icon="AlertTriangle"
          color={overdueAssignments > 0 ? "error" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-error to-red-600 flex items-center justify-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 display-font">Due Today</h3>
                <p className="text-sm text-gray-500">{todayAssignments.length} assignments need attention</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {todayAssignments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle2" className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No assignments due today. Great work!</p>
              </div>
            ) : (
              todayAssignments.map((assignment) => {
                const course = getCourse(assignment.courseId)
                return (
                  <div key={assignment.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      {course && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">{course?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={assignment.priority}>{assignment.priority}</Badge>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleCompleteAssignment(assignment.Id)}
                      >
                        <ApperIcon name="Check" className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 display-font">Upcoming</h3>
                <p className="text-sm text-gray-500">Next 7 days</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingAssignments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CalendarCheck" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming assignments in the next week.</p>
              </div>
            ) : (
              upcomingAssignments.map((assignment) => {
                const course = getCourse(assignment.courseId)
                const daysUntil = getDaysUntilDue(assignment.dueDate)
                return (
                  <div key={assignment.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      {course && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">{course?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                      </span>
                      <Badge variant={assignment.priority}>{assignment.priority}</Badge>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      {/* Course Overview */}
      {courses.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 display-font">Course Performance</h3>
                <p className="text-sm text-gray-500">Current semester grades</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const currentGrade = calculateCourseGrade(course.gradeCategories)
              const letterGrade = currentGrade ? gradeToLetter(currentGrade) : "N/A"
              
              return (
                <div key={course.Id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                    <Badge variant={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "primary" : currentGrade >= 70 ? "warning" : "error"}>
                      {letterGrade}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.professor}</p>
                  {currentGrade && (
                    <p className="text-lg font-semibold text-gray-900">{currentGrade.toFixed(1)}%</p>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard