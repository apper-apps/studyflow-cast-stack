import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Progress from "@/components/atoms/Progress"
import ApperIcon from "@/components/ApperIcon"
import { calculateCourseGrade, gradeToLetter } from "@/utils/gradeUtils"

const CourseGrid = ({ courses, onCourseClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const currentGrade = calculateCourseGrade(course.gradeCategories)
        const letterGrade = currentGrade ? gradeToLetter(currentGrade) : "N/A"
        
        return (
          <Card
            key={course.Id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => onCourseClick?.(course)}
            hover
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: course.color }}
                >
                  <ApperIcon name="BookOpen" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 display-font">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
              </div>
              <Badge variant={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "primary" : currentGrade >= 70 ? "warning" : "error"}>
                {letterGrade}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="User" className="h-4 w-4 mr-2" />
                {course.professor}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                {course.schedule}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                {course.semester} • {course.credits} credits
              </div>
            </div>

            {currentGrade && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Grade</span>
                  <span className="text-sm font-semibold text-gray-900">{currentGrade.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={currentGrade} 
                  max={100} 
                  color={currentGrade >= 90 ? "success" : currentGrade >= 80 ? "primary" : currentGrade >= 70 ? "warning" : "error"}
                />
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default CourseGrid