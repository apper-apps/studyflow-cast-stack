import { toast } from "react-toastify"

export const assignmentService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      }

      const response = await apperClient.fetchRecords("assignment_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(assignment => ({
        Id: assignment.Id,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
        title_c: assignment.title_c || assignment.Name,
        description_c: assignment.description_c,
        due_date_c: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
        priority_c: assignment.priority_c,
        status_c: assignment.status_c,
        grade_c: assignment.grade_c,
        category_c: assignment.category_c
      })) || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message)
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "category_c" } }
        ]
      }

      const response = await apperClient.getRecordById("assignment_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Assignment not found")
      }

      const assignment = response.data
      return {
        Id: assignment.Id,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
        title_c: assignment.title_c || assignment.Name,
        description_c: assignment.description_c,
        due_date_c: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
        priority_c: assignment.priority_c,
        status_c: assignment.status_c,
        grade_c: assignment.grade_c,
        category_c: assignment.category_c
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignment:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: assignmentData.title_c,
          course_id_c: parseInt(assignmentData.course_id_c),
          title_c: assignmentData.title_c,
          description_c: assignmentData.description_c,
          due_date_c: assignmentData.due_date_c ? assignmentData.due_date_c.toISOString().slice(0, 19) : null,
          priority_c: assignmentData.priority_c,
          status_c: assignmentData.status_c,
          grade_c: assignmentData.grade_c,
          category_c: assignmentData.category_c
        }]
      }

      const response = await apperClient.createRecord("assignment_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create assignment")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create assignment")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message)
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

      if (updates.title_c !== undefined) {
        updateData.Name = updates.title_c
        updateData.title_c = updates.title_c
      }
      if (updates.course_id_c !== undefined) updateData.course_id_c = parseInt(updates.course_id_c)
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c
      if (updates.due_date_c !== undefined) {
        updateData.due_date_c = updates.due_date_c instanceof Date ? 
          updates.due_date_c.toISOString().slice(0, 19) : updates.due_date_c
      }
      if (updates.priority_c !== undefined) updateData.priority_c = updates.priority_c
      if (updates.status_c !== undefined) updateData.status_c = updates.status_c
      if (updates.grade_c !== undefined) updateData.grade_c = updates.grade_c
      if (updates.category_c !== undefined) updateData.category_c = updates.category_c

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord("assignment_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update assignment")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update assignment")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message)
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

      const response = await apperClient.deleteRecord("assignment_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return false
    }
  }
}