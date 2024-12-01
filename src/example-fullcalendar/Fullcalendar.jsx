import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

import { useEffect, useRef, useReducer } from 'react'
import { createRoot } from 'react-dom/client'
import ReactCalendar from './ReactCalendar'

import { creatInnerCalendarRoot, calendarReducer, initialState, calendarActions } from './utils'

export default function ExampleFullCalendar() {
  const [state, dispatch] = useReducer(calendarReducer, initialState)
  const updateState = (type, payload) => dispatch({ type, payload })

  const fullCalendarRef = useRef(null)
  useEffect(() => {
    if (fullCalendarRef.current) {
      updateState(calendarActions.fullCalendar, fullCalendarRef.current.calendar)
    }
  }, [fullCalendarRef])

  const handleViewChange = (fullViewInfo) => {
    if (state.fullViewInfo?.view?.type !== fullViewInfo.view.type) {
      updateState(calendarActions.fullViewInfo, fullViewInfo)
    } else {
      if (['timeGridWeek', 'listWeek'].includes(state.fullViewInfo.view.type)) {
        const { start, end } = fullViewInfo
        if (state.setInnerSelect)
          state.setInnerSelect([start, new Date(end.getTime() - 1000)])
      } else {
        const { start } = fullViewInfo
        if (state.setInnerSelect)
          state.setInnerSelect(start)
      }
    }
  }

  const handleDateChange = (fullSelect) => {
    console.log(fullSelect)
    updateState(calendarActions.fullSelect, fullSelect)
  }

  useEffect(() => {
    if (!state.fullCalendar) return
    const { innerCalendar } = creatInnerCalendarRoot(state.fullViewInfo.view.type)
    if (innerCalendar) {
      const root = createRoot(innerCalendar)
      root.render(<ReactCalendar {...{ state, updateState }} />)
      return () => {
        setTimeout(() => root.unmount())
      }
    }
  }, [state.fullViewInfo]) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   console.log("== fullCalendar: ", state)
  // }, [state])

  return (
    <FullCalendar
      ref={fullCalendarRef}
      firstDay={1}
      aspectRatio={1.618}
      height={700}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      locales={[jaLocale]}
      locale='ja'
      initialView='dayGridMonth'
      headerToolbar={{
        left: 'dayGridYear,dayGridMonth today',
        center: 'title',
        right: 'prev,next timeGridWeek listWeek timeGridDay listDay',
      }}
      dateClick={handleDateChange}
      datesSet={handleViewChange}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      // select={(arg)=>console.log(arg)}
      events={events}
      eventContent={renderEventContent}
    />
  )
}

const events = [{ title: 'Meeting', start: new Date() }]

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
