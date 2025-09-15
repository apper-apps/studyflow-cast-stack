import { format, isToday, isTomorrow, isThisWeek, isPast, startOfDay } from "date-fns"

export const formatDate = (date) => {
  if (isToday(date)) {
    return "Today"
  }
  if (isTomorrow(date)) {
    return "Tomorrow"
  }
  if (isThisWeek(date)) {
    return format(date, "EEEE")
  }
  return format(date, "MMM d")
}

export const formatFullDate = (date) => {
  return format(date, "MMM d, yyyy")
}

export const isOverdue = (dueDate) => {
  return isPast(startOfDay(dueDate)) && !isToday(dueDate)
}

export const getDaysUntilDue = (dueDate) => {
  const today = startOfDay(new Date())
  const due = startOfDay(dueDate)
  const diffTime = due - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}