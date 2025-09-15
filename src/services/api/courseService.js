import courseData from "../mockData/courses.json"

let courses = [...courseData]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const courseService = {
  async getAll() {
    await delay(300)
    return [...courses]
  },

  async getById(id) {
    await delay(200)
    const course = courses.find(c => c.Id === parseInt(id))
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
  },

  async create(courseData) {
    await delay(400)
    const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    }
    courses.push(newCourse)
    return { ...newCourse }
  },

  async update(id, updates) {
    await delay(300)
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    courses[index] = { ...courses[index], ...updates }
    return { ...courses[index] }
  },

  async delete(id) {
    await delay(250)
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    courses.splice(index, 1)
    return true
  }
}