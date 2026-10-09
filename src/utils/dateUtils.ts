export const getDaysInMonth = (year: number, month: number) => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  const monthDays = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return monthDays[month - 1]
}

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay()
}

export const sortByDate = (a: { date: { year: number; month: number; day: number } }, b: typeof a) => {
  const dateA = new Date(a.date.year, a.date.month - 1, a.date.day).getTime()
  const dateB = new Date(b.date.year, b.date.month - 1, b.date.day).getTime()
  return dateA - dateB
}