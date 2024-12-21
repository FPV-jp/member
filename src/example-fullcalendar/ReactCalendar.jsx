import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState, useRef } from 'react'

/* eslint-disable react/prop-types */
export default function ReactCalendar({ calendars, setCalendars }) {
  const [innerCalendar, setInnerCalendar] = useState(null)
  const [innerSelect, setInnerSelect] = useState(calendars.innerSelect || new Date())
  const innerCalendarRef = useRef(null)

  useEffect(() => {
    if (innerCalendarRef.current) {
      setInnerCalendar(innerCalendarRef.current)
      setCalendars((prevState) => ({ ...prevState, innerCalendar: innerCalendarRef.current }))
    }
  }, [innerCalendarRef]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setInnerSelect(calendars.innerSelect)
  }, [calendars.innerSelect])

  const handleDateChange = (selectedDate) => {
    if (['timeGridWeek', 'listWeek'].includes(calendars.fullViewInfo.view.type)) {
      const weekNumber = selectedDate.getWeek()
      const { start, end } = getWeekRangeByWeekNumber(selectedDate.getFullYear(), weekNumber)
      console.log([start, end])
      setInnerSelect([start, end])
      setCalendars((prevState) => ({ ...prevState, innerSelect: [start, end] }))
    } else {
      setInnerSelect(selectedDate)
      setCalendars((prevState) => ({ ...prevState, innerSelect: selectedDate }))
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
      <Calendar
        ref={innerCalendarRef}
        calendarType='iso8601'
        showDoubleView={['timeGridWeek'].includes(calendars.fullViewInfo.view.type)}
        showWeekNumbers={['timeGridWeek', 'listWeek'].includes(calendars.fullViewInfo.view.type)}
        showFixedNumberOfWeeks={['timeGridWeek', 'listWeek'].includes(calendars.fullViewInfo.view.type)}
        value={innerSelect}
        onChange={handleDateChange}
      // onClickWeekNumber={(value) => {
      //   console.log(innerCalendar)
      //   console.log('===onClickWeekNumber value ===', value)
      // }}
      // onClickYear={(value) => {
      //   console.log("===onClickYear value ===", value)
      // }}
      // onClickMonth={(value) => {
      //   console.log("===onClickMonth value ===", value)
      // }}
      // onClickDay={(value) => {
      //   console.log("===onClickDay value ===", value)
      //   console.log("===onClickDay value ===", new Date(value))
      //   // console.log("===onClickDay event ===", event)
      // }}
      // onViewChange={(action) => {
      //   console.log("===onViewChange action ===", action)
      // }}
      // onDrillDown={(action) => {
      //   console.log("===onDrillDown action ===", action)
      // }}
      // onDrillUp={(action) => {
      //   console.log("===onDrillUp action ===", action)
      // }}
      // onActiveStartDateChange={(action) => {
      //   console.log('===onActiveStartDateChange action ===', action)
      // }}
      />
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
