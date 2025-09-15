import { toast } from "react-toastify"

export const studySessionService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "topic_c" } },
          { field: { Name: "completed_c" } }
        ]
      }

      const response = await apperClient.fetchRecords("study_session_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(session => ({
        Id: session.Id,
        course_id_c: session.course_id_c?.Id || session.course_id_c,
        date_c: session.date_c ? new Date(session.date_c) : null,
        duration_c: session.duration_c,
        topic_c: session.topic_c || session.Name,
        completed_c: session.completed_c
      })) || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching study sessions:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "topic_c" } },
          { field: { Name: "completed_c" } }
        ]
      }

      const response = await apperClient.getRecordById("study_session_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Study session not found")
      }

      const session = response.data
      return {
        Id: session.Id,
        course_id_c: session.course_id_c?.Id || session.course_id_c,
        date_c: session.date_c ? new Date(session.date_c) : null,
        duration_c: session.duration_c,
        topic_c: session.topic_c || session.Name,
        completed_c: session.completed_c
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching study session:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  },

  async create(sessionData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: sessionData.topic_c,
          course_id_c: parseInt(sessionData.course_id_c),
          date_c: sessionData.date_c ? sessionData.date_c.toISOString().slice(0, 19) : null,
          duration_c: sessionData.duration_c,
          topic_c: sessionData.topic_c,
          completed_c: sessionData.completed_c
        }]
      }

      const response = await apperClient.createRecord("study_session_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create study session")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create study session ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create study session")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating study session:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const updateData = {
        Id: parseInt(id)
      }

      if (updates.topic_c !== undefined) {
        updateData.Name = updates.topic_c
        updateData.topic_c = updates.topic_c
      }
      if (updates.course_id_c !== undefined) updateData.course_id_c = parseInt(updates.course_id_c)
      if (updates.date_c !== undefined) {
        updateData.date_c = updates.date_c instanceof Date ? 
          updates.date_c.toISOString().slice(0, 19) : updates.date_c
      }
      if (updates.duration_c !== undefined) updateData.duration_c = updates.duration_c
      if (updates.completed_c !== undefined) updateData.completed_c = updates.completed_c

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord("study_session_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update study session")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update study session ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update study session")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating study session:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord("study_session_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete study session ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting study session:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return false
    }
  }
}