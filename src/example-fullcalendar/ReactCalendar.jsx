import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useEffect, useState, useRef } from 'react'
import * as Utils from './utils'

/* eslint-disable react/prop-types */
export default function ReactCalendar({ state, updateState }) {
  const [innerSelect, setInnerSelect] = useState(state.innerSelect || new Date())
  const innerCalendarRef = useRef(null)

  useEffect(() => {
    if (innerCalendarRef.current) {
      updateState(Utils.calendarActions.innerCalendar, innerCalendarRef.current)
      updateState(Utils.calendarActions.setInnerSelect, setInnerSelect)
    }
  }, [innerCalendarRef]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (selectedDate) => {
    if (['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)) {

      const weekNumber = selectedDate.getWeek()
      const { start, end } = Utils.getWeekRangeByWeekNumber(selectedDate.getFullYear(), weekNumber)
      setInnerSelect([start, end])
      updateState(Utils.calendarActions.innerSelect, [start, end])
      state.fullCalendar.gotoDate(start)

      if (['timeGridWeek'].includes(state.fullViewInfo.view.type)) {
        Utils.closeInnerCalendar()
      }

    } else {

      setInnerSelect(selectedDate)
      updateState(Utils.calendarActions.innerSelect, selectedDate)
      state.fullCalendar.gotoDate(selectedDate)

    }
  }

  // useEffect(() => {
  //   console.log('== innerCalendar: ', state)
  // }, [state])

  return (
    <div className='hidden w-full justify-end sm:flex'>
      <Calendar ref={innerCalendarRef} calendarType='iso8601' showDoubleView={['timeGridWeek'].includes(state.fullViewInfo.view.type)} showWeekNumbers={['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)} showFixedNumberOfWeeks={['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)} value={innerSelect} onChange={handleDateChange} />
    </div>
  )
}
