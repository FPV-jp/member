import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState, useRef } from 'react'

/* eslint-disable react/prop-types */
export default function ReactCalendar({ calendars, setCalendars }) {

  const [value, setValue] = useState(new Date())
  const innerCalendarRef = useRef(null)

  useEffect(() => {
    if (innerCalendarRef.current) {
      setCalendars((prevState) => ({ ...prevState, innerCalendar: innerCalendarRef.current }))
    }
  }, [innerCalendarRef, calendars, setCalendars])

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
      <Calendar
        ref={innerCalendarRef}
        value={value}
        onChange={(value) => { setValue(value) }}
        calendarType='gregory'
      />
    </div>
  )
}