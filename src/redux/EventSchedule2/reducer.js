const initialState = {
  calendar: {},

  viewType: '',
  listMode: false,

  activeStart: null,
  activeEnd: null,

  currentStart: null,
  currentEnd: null,

  title: '',
  showDate: null,
  selectStart: null,
  selectEnd: null,

  events: [
    { allDay: true, title: 'あああ', start: '2024-03-03', end: '2024-03-04', id: 'ae3852a18-e319-4336-b955-ba5bd72ec5eca' },
    { allDay: true, title: 'いいい', start: '2024-03-04', end: '2024-03-05', id: 'a5749f304-2309-431e-8b6a-a80808d4dddca' },
    { allDay: true, title: 'ううう', start: '2024-03-05', end: '2024-03-06', id: 'af95ec905-ed81-4bb9-be2c-50fe53fe7bb3a' },
    { allDay: true, title: 'ええええ', start: '2024-03-06', end: '2024-03-07', id: 'aabf2a4b7-f4ef-4b46-a408-4d9d37b094d2a' },
    { allDay: true, title: 'おおおお', start: '2024-03-13', end: '2024-03-14', id: 'a76086f12-69dd-4351-ab2e-cd37deb1c8a7a' },
  ],
}

export default function FullCalendarReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CALENDAR': {
      const current = action.calendar.view.getCurrentData()
      const temp = {
        showDate: current.currentDate,
        viewType: current.currentViewType,
        listMode: current.currentViewType === 'listWeek' || current.currentViewType === 'listDay',
      }
      const { activeStart, activeEnd, currentStart, currentEnd, title } = action.calendar.view
      const temp2 = {
        activeStart: activeStart,
        activeEnd: activeEnd,
        currentStart: currentStart,
        currentEnd: currentEnd,
        title: title,
      }
      return {
        ...state,
        calendar: action.calendar,
        ...temp,
        ...temp2,
      }
    }

    case 'CHANGE_SELECT_DATE': {
      const temp = {
        selectStart: action.selectInfo.start,
        selectEnd: action.selectInfo.end,
      }
      return {
        ...state,
        ...temp,
      }
    }

    case 'CHANGE_LIST_MODE':
      return {
        ...state,
        listMode: action.listMode,
      }

    case 'CHANGE_VIEW_TYPE':
      return {
        ...state,
        viewType: action.viewType,
      }

    case 'RECEIVE_EVENTS':
      return {
        ...state,
        events: action.events,
      }

    case 'CREATE_EVENT':
      return {
        ...state,
        events: [...state.events, action.event],
      }

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) => {
          if (event.id === action.event.id) {
            return action.event
          }
          return event
        }),
      }

    case 'DELETE_EVENT':
      state = { ...state } // copy
      delete state[action.eventId]
      return state

    default:
      return state
  }
}
