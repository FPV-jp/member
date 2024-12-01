import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState, useRef } from 'react'
import { calendarActions } from './utils'

/* eslint-disable react/prop-types */
export default function ReactCalendar({ state, updateState }) {
  const [innerSelect, setInnerSelect] = useState(state.innerSelect || new Date())
  const innerCalendarRef = useRef(null)

  useEffect(() => {
    if (innerCalendarRef.current) {
      updateState(calendarActions.innerCalendar, innerCalendarRef.current)
      updateState(calendarActions.setInnerSelect, setInnerSelect)
    }
  }, [innerCalendarRef]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (selectedDate) => {
    if (['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)) {
      const weekNumber = selectedDate.getWeek()
      const { start, end } = getWeekRangeByWeekNumber(selectedDate.getFullYear(), weekNumber)
      setInnerSelect([start, end])
      updateState(calendarActions.innerSelect, [start, end])
      state.fullCalendar.gotoDate(start)
    } else {
      setInnerSelect(selectedDate)
      updateState(calendarActions.innerSelect, selectedDate)
      state.fullCalendar.gotoDate(selectedDate)
    }
  }

  useEffect(() => {
    console.log('== innerCalendar: ', state)
  }, [state])

  return (
    <div className="hidden sm:flex w-full justify-end" >
      <Calendar ref={innerCalendarRef} calendarType='iso8601' showDoubleView={['timeGridWeek'].includes(state.fullViewInfo.view.type)} showWeekNumbers={['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)} showFixedNumberOfWeeks={['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)} value={innerSelect} onChange={handleDateChange} />
    </div>
  )
}

Date.prototype.getWeek = function () {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1)
  const pastDaysOfYear = Math.floor((this - firstDayOfYear) / 86400000) + 1
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7)
}

function getWeekRangeByWeekNumber(year, weekNumber) {
  // Find the first Thursday of the year (based on ISO 8601).
  const jan4 = new Date(year, 0, 4)
  const firstWeekStart = new Date(jan4)
  firstWeekStart.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7))

  // startOfWeek
  const startOfWeek = new Date(firstWeekStart)
  startOfWeek.setDate(firstWeekStart.getDate() + (weekNumber - 1) * 7)

  // endOfWeek
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return { start: startOfWeek, end: endOfWeek }
}
