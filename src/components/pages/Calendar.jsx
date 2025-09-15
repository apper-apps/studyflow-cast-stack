import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns"

const Calendar = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

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
      setError("Failed to load calendar data")
    } finally {
      setLoading(false)
    }
  }

  const getCourse = (courseId) => courses.find(c => c.Id === parseInt(courseId))

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    )
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }

  if (loading) return <Loading message="Loading calendar..." />
  if (error) return <Error message={error} onRetry={loadData} />

  if (assignments.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Empty 
          title="No assignments scheduled"
          description="Your calendar will show assignment due dates once you start adding assignments."
          icon="Calendar"
          actionText="Add Assignment"
        />
      </div>
    )
  }

  const calendarDays = generateCalendarDays()
  const selectedDateAssignments = getAssignmentsForDate(selectedDate)

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 display-font">Calendar</h1>
          <p className="text-gray-600 mt-1">Track assignment due dates and academic schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 display-font">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <p className="text-sm text-gray-500">Academic Calendar</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ApperIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center">
                  <span className="text-sm font-medium text-gray-600">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayAssignments = getAssignmentsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentDay = isToday(day)

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border border-gray-100 cursor-pointer transition-all duration-200
                      ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50/50"}
                      ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
                      ${isCurrentDay ? "bg-gradient-to-br from-primary/10 to-secondary/10" : ""}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                      ${isCurrentDay ? "text-primary font-bold" : ""}
                    `}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAssignments.slice(0, 2).map((assignment) => {
                        const course = getCourse(assignment.courseId)
                        return (
                          <div
                            key={assignment.Id}
                            className="text-xs p-1 rounded truncate"
                            style={{ 
                              backgroundColor: course?.color + "20", 
                              borderLeft: `3px solid ${course?.color}` 
                            }}
                            title={assignment.title}
                          >
                            {assignment.title}
                          </div>
                        )
                      })}
                      {dayAssignments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAssignments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 display-font">
                  {format(selectedDate, "MMM d, yyyy")}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDateAssignments.length} assignment{selectedDateAssignments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedDateAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No assignments due</p>
                </div>
              ) : (
                selectedDateAssignments.map((assignment) => {
                  const course = getCourse(assignment.courseId)
                  return (
                    <div key={assignment.Id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                        <Badge variant={assignment.priority} className="text-xs">
                          {assignment.priority}
                        </Badge>
                      </div>
                      {course && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="text-xs text-gray-600">{course.name}</span>
                        </div>
                      )}
                      <Badge variant={assignment.status} className="text-xs">
                        {assignment.status}
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 display-font">Upcoming</h3>
                <p className="text-sm text-gray-500">Next 7 days</p>
              </div>
            </div>

            <div className="space-y-2">
              {assignments
                .filter(a => {
                  const dueDate = new Date(a.dueDate)
                  const today = new Date()
                  const nextWeek = new Date()
                  nextWeek.setDate(today.getDate() + 7)
                  return dueDate >= today && dueDate <= nextWeek && a.status !== "completed"
                })
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map((assignment) => {
                  const course = getCourse(assignment.courseId)
                  return (
                    <div key={assignment.Id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      {course && (
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(assignment.dueDate), "MMM d")}
                        </p>
                      </div>
                      <Badge variant={assignment.priority} className="text-xs">
                        {assignment.priority}
                      </Badge>
                    </div>
                  )
                })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Calendar