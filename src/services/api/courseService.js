import { toast } from "react-toastify"

export const courseService = {
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
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      }

      const response = await apperClient.fetchRecords("course_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(course => ({
        Id: course.Id,
        name_c: course.name_c || course.Name,
        code_c: course.code_c,
        professor_c: course.professor_c,
        schedule_c: course.schedule_c,
        color_c: course.color_c,
        semester_c: course.semester_c,
        credits_c: course.credits_c,
        grade_categories_c: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
      })) || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message)
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
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      }

      const response = await apperClient.getRecordById("course_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Course not found")
      }

      const course = response.data
      return {
        Id: course.Id,
        name_c: course.name_c || course.Name,
        code_c: course.code_c,
        professor_c: course.professor_c,
        schedule_c: course.schedule_c,
        color_c: course.color_c,
        semester_c: course.semester_c,
        credits_c: course.credits_c,
        grade_categories_c: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      throw error
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: courseData.name_c,
          name_c: courseData.name_c,
          code_c: courseData.code_c,
          professor_c: courseData.professor_c,
          schedule_c: courseData.schedule_c,
          color_c: courseData.color_c,
          semester_c: courseData.semester_c,
          credits_c: courseData.credits_c,
          grade_categories_c: JSON.stringify(courseData.grade_categories_c || [])
        }]
      }

      const response = await apperClient.createRecord("course_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to create course")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to create course")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message)
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

      if (updates.name_c !== undefined) {
        updateData.Name = updates.name_c
        updateData.name_c = updates.name_c
      }
      if (updates.code_c !== undefined) updateData.code_c = updates.code_c
      if (updates.professor_c !== undefined) updateData.professor_c = updates.professor_c
      if (updates.schedule_c !== undefined) updateData.schedule_c = updates.schedule_c
      if (updates.color_c !== undefined) updateData.color_c = updates.color_c
      if (updates.semester_c !== undefined) updateData.semester_c = updates.semester_c
      if (updates.credits_c !== undefined) updateData.credits_c = updates.credits_c
      if (updates.grade_categories_c !== undefined) updateData.grade_categories_c = JSON.stringify(updates.grade_categories_c)

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord("course_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error("Failed to update course")
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error("Failed to update course")
        }
        return response.results[0].data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message)
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

      const response = await apperClient.deleteRecord("course_c", params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message)
      } else {
        console.error(error)
      }
      return false
    }
  }
}