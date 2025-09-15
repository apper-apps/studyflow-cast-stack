import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import CourseGrid from "@/components/organisms/CourseGrid"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    // Filter courses based on search term
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [courses, searchTerm])

  const loadCourses = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await courseService.getAll()
      setCourses(data)
    } catch (error) {
      setError("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (course) => {
    toast.info(`Selected ${course.name}`)
  }

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={loadCourses} />

  if (courses.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Empty 
          title="No courses yet"
          description="Start by adding your first course to begin tracking your academic progress."
          icon="BookOpen"
          actionText="Add Course"
        />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 display-font">Courses</h1>
          <p className="text-gray-600 mt-1">Manage your enrolled courses</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <ApperIcon name="BookOpen" className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-success/10 to-green-600/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Semester</p>
              <p className="text-2xl font-bold text-gray-900">Spring 2024</p>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-success" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{courses.reduce((sum, course) => sum + course.credits, 0)}</p>
            </div>
            <ApperIcon name="Award" className="h-8 w-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      ) : (
        <CourseGrid courses={filteredCourses} onCourseClick={handleCourseClick} />
      )}
    </div>
  )
}

export default Courses