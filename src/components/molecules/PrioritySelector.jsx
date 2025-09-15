import React from "react"
import Select from "@/components/atoms/Select"
import { PRIORITY_LEVELS } from "@/utils/constants"

const PrioritySelector = ({ value, onChange, ...props }) => {
  const priorityOptions = [
    { value: "", label: "Select Priority" },
    { value: PRIORITY_LEVELS.HIGH, label: "High Priority" },
    { value: PRIORITY_LEVELS.MEDIUM, label: "Medium Priority" },
    { value: PRIORITY_LEVELS.LOW, label: "Low Priority" }
  ]

  return (
    <Select value={value} onChange={onChange} {...props}>
      {priorityOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}

export default PrioritySelector