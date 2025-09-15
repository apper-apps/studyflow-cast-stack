export const calculateGPA = (courses) => {
  if (!courses || courses.length === 0) return 0

  let totalPoints = 0
  let totalCredits = 0

  courses.forEach(course => {
    const courseGrade = calculateCourseGrade(course.gradeCategories)
    if (courseGrade !== null) {
      totalPoints += gradeToGPA(courseGrade) * course.credits
      totalCredits += course.credits
    }
  })

  return totalCredits === 0 ? 0 : (totalPoints / totalCredits)
}

export const calculateCourseGrade = (categories) => {
  if (!categories || categories.length === 0) return null

  let totalWeightedScore = 0
  let totalWeight = 0

  categories.forEach(category => {
    if (category.grades && category.grades.length > 0) {
      const categoryAverage = category.grades.reduce((sum, grade) => sum + grade.score, 0) / category.grades.length
      totalWeightedScore += categoryAverage * (category.weight / 100)
      totalWeight += category.weight / 100
    }
  })

  return totalWeight === 0 ? null : totalWeightedScore / totalWeight
}

export const gradeToLetter = (grade) => {
  if (grade >= 97) return "A+"
  if (grade >= 93) return "A"
  if (grade >= 90) return "A-"
  if (grade >= 87) return "B+"
  if (grade >= 83) return "B"
  if (grade >= 80) return "B-"
  if (grade >= 77) return "C+"
  if (grade >= 73) return "C"
  if (grade >= 70) return "C-"
  if (grade >= 67) return "D+"
  if (grade >= 63) return "D"
  if (grade >= 60) return "D-"
  return "F"
}

export const gradeToGPA = (grade) => {
  if (grade >= 97) return 4.0
  if (grade >= 93) return 4.0
  if (grade >= 90) return 3.7
  if (grade >= 87) return 3.3
  if (grade >= 83) return 3.0
  if (grade >= 80) return 2.7
  if (grade >= 77) return 2.3
  if (grade >= 73) return 2.0
  if (grade >= 70) return 1.7
  if (grade >= 67) return 1.3
  if (grade >= 63) return 1.0
  if (grade >= 60) return 0.7
  return 0.0
}