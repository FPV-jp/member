import { requestEventsInRange, requestEventCreate, requestEventUpdate, requestEventDelete } from './requests'

export default {
  setCalendar(calendar) {
    return async (dispatch) => {
      dispatch({
        type: 'SET_CALENDAR',
        calendar,
      })
    }
  },

  changeSelectDate(selectInfo) {
    return async (dispatch) => {
      dispatch({
        type: 'CHANGE_SELECT_DATE',
        selectInfo,
      })
    }
  },

  requestEvents(startStr, endStr) {
    return async (dispatch) => {
      const events = await requestEventsInRange(startStr, endStr)
      dispatch({
        type: 'RECEIVE_EVENTS',
        events,
      })
    }
  },

  createEvent(event) {
    return async (dispatch) => {
      const newEventId = await requestEventCreate(event)
      dispatch({
        type: 'CREATE_EVENT',
        event: {
          id: newEventId,
          ...event,
        },
      })
    }
  },

  updateEvent(event) {
    return async (dispatch) => {
      await requestEventUpdate(event)
      dispatch({
        type: 'UPDATE_EVENT',
        event,
      })
    }
  },

  deleteEvent(eventId) {
    return async (dispatch) => {
      await requestEventDelete(eventId)
      dispatch({
        type: 'DELETE_EVENT',
        eventId,
      })
    }
  },
}
