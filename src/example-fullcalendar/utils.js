
Date.prototype.getWeek = function () {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1)
  const pastDaysOfYear = Math.floor((this - firstDayOfYear) / 86400000) + 1
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7)
}

export function getWeekRangeByWeekNumber(year, weekNumber) {
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


export const initialState = {
  fullCalendar: null,
  fullViewInfo: null,
  fullSelect: null,
  innerCalendar: null,
  innerSelect: null,
}

export const calendarActions = {
  fullCalendar: 'UPDATE_FULL_CALENDAR',
  fullViewInfo: 'UPDATE_FULL_VIEW_INFO',
  fullSelect: 'UPDATE_FULL_SELECT',
  innerCalendar: 'UPDATE_INNER_CALENDAR',
  innerSelect: 'UPDATE_INNER_SELECT',
  setInnerSelect: 'UPDATE_SET_INNER_SELECT',
  resetCalendars: 'RESET_CALENDARS',
}

export function calendarReducer(state, action) {
  switch (action.type) {
    case calendarActions.fullCalendar:
      return { ...state, fullCalendar: action.payload }
    case calendarActions.fullViewInfo:
      return { ...state, fullViewInfo: action.payload }
    case calendarActions.fullSelect:
      return { ...state, fullSelect: action.payload }
    case calendarActions.innerCalendar:
      return { ...state, innerCalendar: action.payload }
    case calendarActions.innerSelect:
      return { ...state, innerSelect: action.payload }
    case calendarActions.setInnerSelect:
      return { ...state, setInnerSelect: action.payload }
    case calendarActions.resetCalendars:
      return initialState
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export function closeInnerCalendar(){
  const $ = (query) => document.querySelector(query)
  const innerCalendar = $('div.inner-calendar')
  if (innerCalendar) {
    innerCalendar.style.display = 'none'
  }
}

export function creatInnerCalendarRoot(currentView) {
  const $ = (query) => document.querySelector(query)
  const $$ = (query) => document.querySelectorAll(query)

  const openButton = 'button.fc-open-button.fc-button.fc-button-primary'
  if ($(openButton)) $(openButton).parentNode.removeChild($(openButton))
  if (currentView === 'timeGridWeek') {
    let toolbars = $$('div.fc-toolbar-chunk')
    let openButton = document.createElement('button')
    openButton.classList.add('fc-open-button', 'fc-button', 'fc-button-primary')
    openButton.title = 'Open'
    openButton.innerText = 'Open'
    openButton.onclick = () => {
      const innerCalendar = $('div.inner-calendar')
      if (innerCalendar) {
        innerCalendar.style.display === 'none' ? (innerCalendar.style.display = 'block') : (innerCalendar.style.display = 'none')
      }
    }
    toolbars[2].insertBefore(openButton, toolbars[2].firstChild)
  }

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

  let innerCalendar = document.createElement('div')
  innerCalendar.classList.add('inner-calendar')
  if (currentView === 'timeGridWeek') {
    innerCalendar.style.display = 'none'
  }

  if (parent && brother) {
    currentView === 'timeGridWeek' ? parent.insertBefore(innerCalendar, parent.firstChild) : parent.appendChild(innerCalendar)
    if (currentView === 'timeGridWeek') {
      parent.style.display = null
      brother.style.flex = null
      innerCalendar.style.flex = null
    } else {
      parent.style.display = 'flex'
      brother.style.flex = '1 1 0%'
      innerCalendar.style.flex = '0 1 0%'
    }
  }
  return { innerCalendar }
}
