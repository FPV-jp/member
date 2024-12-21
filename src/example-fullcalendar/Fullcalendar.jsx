import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import ReactCalendar from './ReactCalendar'

export default function ExampleFullCalendar() {

  const [calendars, setCalendars] = useState({
    fullCalendar: null,
    fullViewInfo: null,
    innerCalendar: null,
    innerSelect: new Date(),
  })

  const fullCalendarRef = useRef(null)
  useEffect(() => {
    if (fullCalendarRef.current) {
      console.log("fullCalendarRef")
      setCalendars((prevState) => ({ ...prevState, fullCalendar: fullCalendarRef.current.calendar }))
    }
  }, [fullCalendarRef])

  const handleViewChange = (fullViewInfo) => {
    if (calendars.fullViewInfo?.view?.type !== fullViewInfo.view.type) {
      setCalendars((prevState) => ({ ...prevState, fullViewInfo }))
    }
  }

  useEffect(() => {
    console.log(calendars)
  }, [calendars])

  useEffect(() => {
    if (!calendars.fullCalendar) return
    recombination(
      calendars.fullViewInfo.view.type,
      <ReactCalendar {...{ calendars, setCalendars }} />,
    )
  }, [calendars])

  return (
    <FullCalendar
      ref={fullCalendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      locales={[jaLocale]}
      locale='ja'
      initialView='dayGridMonth'
      headerToolbar={{
        left: 'dayGridYear,dayGridMonth today',
        center: 'title',
        right: 'prev,next timeGridWeek listWeek timeGridDay listDay',
      }}
      datesSet={handleViewChange}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      events={events}
      eventContent={renderEventContent}
    />
  )
}

function recombination(currentView, calendar) {
  const $ = (query) => document.querySelector(query)
  let parent
  let brother

  if (currentView === 'timeGridDay' || currentView === 'timeGridWeek') {
    parent = $(`div.fc-${currentView}-view.fc-view.fc-timegrid`)
    brother = $('table.fc-scrollgrid.fc-scrollgrid-liquid')
  }

  if (currentView === 'listWeek' || currentView === 'listDay') {
    parent = $(`div.fc-${currentView}-view.fc-view.fc-list.fc-list-sticky`)
    brother = $('div.fc-scroller.fc-scroller-liquid')
  }

  const attachCalendar = () => {
    const innerCalendar = document.createElement('div')
    innerCalendar.classList.add('innerCalendar')
    createRoot(innerCalendar).render(calendar)
    currentView === 'timeGridWeek' ? parent.insertBefore(innerCalendar, parent.firstChild) : parent.appendChild(innerCalendar)
  }

  if (parent && brother) {
    if (!$('div.innerCalendar')) {
      attachCalendar()
    } else {
      var index = Array.prototype.indexOf.call(parent.children, $('div.innerCalendar'))
      if (currentView === 'timeGridWeek' && index === 1) {
        $('div.innerCalendar').parentNode.removeChild($('div.innerCalendar'))
        attachCalendar()
      } else if (currentView === 'timeGridDay' && index === 0) {
        $('div.innerCalendar').parentNode.removeChild($('div.innerCalendar'))
        attachCalendar()
      }
    }

    if (currentView === 'timeGridWeek') {
      parent.classList.remove('flex')
      brother.classList.remove('flex-1')
      $('div.innerCalendar').classList.remove('flex-1')
    } else {
      parent.classList.add('flex')
      brother.classList.add('flex-1')
      $('div.innerCalendar').classList.add('flex-1')
    }
    return
  }
}

const events = [
  { title: 'Meeting', start: new Date() }
]

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}