import assignmentData from "../mockData/assignments.json"

let assignments = [...assignmentData]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const assignmentService = {
  async getAll() {
    await delay(350)
    return assignments.map(assignment => ({
      ...assignment,
      dueDate: new Date(assignment.dueDate)
    }))
  },

  async getById(id) {
    await delay(200)
    const assignment = assignments.find(a => a.Id === parseInt(id))
    if (!assignment) {
      throw new Error("Assignment not found")
    }
    return {
      ...assignment,
      dueDate: new Date(assignment.dueDate)
    }
  },

  async create(assignmentData) {
    await delay(400)
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      dueDate: assignmentData.dueDate.toISOString()
    }
    assignments.push(newAssignment)
    return {
      ...newAssignment,
      dueDate: new Date(newAssignment.dueDate)
    }
  },

  async update(id, updates) {
    await delay(300)
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    
    const updatedAssignment = {
      ...assignments[index],
      ...updates
    }
    
    if (updates.dueDate && updates.dueDate instanceof Date) {
      updatedAssignment.dueDate = updates.dueDate.toISOString()
    }
    
    assignments[index] = updatedAssignment
    
    return {
      ...updatedAssignment,
      dueDate: new Date(updatedAssignment.dueDate)
    }
  },

  async delete(id) {
    await delay(250)
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments.splice(index, 1)
    return true
  }
}