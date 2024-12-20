import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'

export function InnerCalendar() {
  const [value, setValue] = useState(new Date())
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
      <Calendar
        value={value}
        onChange={(value) => {setValue(value)}}
        calendarType='gregory'
      />
    </div>
  )
}