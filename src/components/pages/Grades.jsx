import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Progress from "@/components/atoms/Progress"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { calculateGPA, calculateCourseGrade, gradeToLetter } from "@/utils/gradeUtils"

const Grades = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await courseService.getAll()
      setCourses(data)
      if (data.length > 0) {
        setSelectedCourse(data[0])
      }
    } catch (error) {
      setError("Failed to load courses and grades")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading grades..." />
  if (error) return <Error message={error} onRetry={loadCourses} />

  if (courses.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Empty 
          title="No courses with grades"
          description="Start by adding courses and their grade categories to track your academic performance."
          icon="Award"
          actionText="Add Course"
        />
      </div>
    )
  }

  const currentGPA = calculateGPA(courses)

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 display-font">Grades</h1>
          <p className="text-gray-600 mt-1">Track your academic performance</p>
        </div>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current GPA</p>
              <p className="text-4xl font-bold text-gray-900 mt-1 display-font">{currentGPA.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Out of 4.0</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="Award" className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={currentGPA} 
              max={4} 
              color={currentGPA >= 3.5 ? "success" : currentGPA >= 3.0 ? "primary" : currentGPA >= 2.5 ? "warning" : "error"}
              size="lg"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-4xl font-bold text-gray-900 mt-1 display-font">
{courses.reduce((sum, course) => sum + course.credits_c, 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Current semester</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-green-600 flex items-center justify-center">
              <ApperIcon name="BookOpen" className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Grade Status</p>
              <p className="text-4xl font-bold text-gray-900 mt-1 display-font">
                {gradeToLetter(currentGPA * 25)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Letter grade</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{courses.map((course) => {
          const currentGrade = calculateCourseGrade(course.grade_categories_c)
          const letterGrade = currentGrade ? gradeToLetter(currentGrade) : "N/A"
          
          return (
            <Card key={course.Id} className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: course.color_c }}
                  >
                    <ApperIcon name="BookOpen" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 display-font">{course.name_c}</h3>
                    <p className="text-sm text-gray-500">{course.code_c} • {course.credits_c} credits</p>
                  </div>
                </div>
                <Badge variant={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "primary" : currentGrade >= 70 ? "warning" : "error"}>
                  {letterGrade}
                </Badge>
              </div>

              {currentGrade ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Overall Grade</span>
                    <span className="text-2xl font-bold text-gray-900">{currentGrade.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={currentGrade} 
                    max={100} 
                    color={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "primary" : currentGrade >= 70 ? "warning" : "error"}
                    size="lg"
                  />

                  {course.gradeCategories && course.gradeCategories.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Grade Breakdown</h4>
{course.grade_categories_c?.map((category, index) => {
                        const categoryAverage = category.grades && category.grades.length > 0 
                          ? category.grades.reduce((sum, grade) => sum + grade.score, 0) / category.grades.length
                          : 0
                        
                        return (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              {category.name} ({category.weight}%)
                            </span>
                            <span className="font-medium text-gray-900">
                              {categoryAverage.toFixed(1)}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <ApperIcon name="BarChart3" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No grades recorded yet</p>
                  <Button size="sm" className="mt-2">
                    <ApperIcon name="Plus" className="h-3 w-3 mr-1" />
                    Add Grade
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* GPA Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 display-font">Academic Performance</h3>
              <p className="text-sm text-gray-500">Your GPA breakdown by course</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
{courses.map((course) => {
            const currentGrade = calculateCourseGrade(course.grade_categories_c)
            const gpaPoints = currentGrade ? (currentGrade / 100) * 4 : 0
            
            return (
              <div key={course.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: course.color_c }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{course.name_c}</p>
                    <p className="text-sm text-gray-500">{course.credits_c} credits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {gpaPoints.toFixed(2)} GPA
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentGrade ? `${currentGrade.toFixed(1)}%` : "No grades"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Grades