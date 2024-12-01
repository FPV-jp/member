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

export function creatInnerCalendarRoot(currentView) {
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

  // let innerCalendar = $('div.innerCalendar')
  // if (innerCalendar) {
  //   $('div.innerCalendar').parentNode.removeChild($('div.innerCalendar'))
  // }
  let innerCalendar = document.createElement('div')
  innerCalendar.classList.add('innerCalendar')

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
