import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState, useRef } from 'react'

/* eslint-disable react/prop-types */
export default function ReactCalendar({ calendars, setCalendars }) {

  // const [value, setValue] = useState(new Date())
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
        // showNavigation
        // selectRange
        // showDoubleView
        // showWeekNumbers
        // showFixedNumberOfWeeks
        // showNeighboringMonth
        value={calendars.innerSelect}
        onChange={(innerSelect) => {
          setCalendars((prevState) => ({ ...prevState, innerSelect }))
          // console.log("===onChange value ===", innerSelect)
          // setValue(value)
        }}
        // onClickWeekNumber={(value) => {
        //   console.log("===onClickWeekNumber value ===", value)
        // }}
        // onClickYear={(value) => {
        //   console.log("===onClickYear value ===", value)
        // }}
        // onClickMonth={(value) => {
        //   console.log("===onClickMonth value ===", value)
        // }}
        // onClickDay={(value) => {
        //   console.log("===onClickDay value ===", value)
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
        //   console.log("===onActiveStartDateChange action ===", action)
        // }}
        calendarType='gregory'
      />
    </div>
  )
}