import studySessionData from "../mockData/studySessions.json"

let studySessions = [...studySessionData]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const studySessionService = {
  async getAll() {
    await delay(300)
    return studySessions.map(session => ({
      ...session,
      date: new Date(session.date)
    }))
  },

  async getById(id) {
    await delay(200)
    const session = studySessions.find(s => s.Id === parseInt(id))
    if (!session) {
      throw new Error("Study session not found")
    }
    return {
      ...session,
      date: new Date(session.date)
    }
  },

  async create(sessionData) {
    await delay(400)
    const maxId = studySessions.length > 0 ? Math.max(...studySessions.map(s => s.Id)) : 0
    const newSession = {
      ...sessionData,
      Id: maxId + 1,
      date: sessionData.date.toISOString()
    }
    studySessions.push(newSession)
    return {
      ...newSession,
      date: new Date(newSession.date)
    }
  },

  async update(id, updates) {
    await delay(300)
    const index = studySessions.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Study session not found")
    }
    
    const updatedSession = {
      ...studySessions[index],
      ...updates
    }
    
    if (updates.date && updates.date instanceof Date) {
      updatedSession.date = updates.date.toISOString()
    }
    
    studySessions[index] = updatedSession
    
    return {
      ...updatedSession,
      date: new Date(updatedSession.date)
    }
  },

  async delete(id) {
    await delay(250)
    const index = studySessions.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Study session not found")
    }
    studySessions.splice(index, 1)
    return true
  }
}