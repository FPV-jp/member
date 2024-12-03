import { v4 } from 'uuid'

/*
functions that simulate network requests
*/

let eventDb = [
  { allDay: true, title: 'あああ', start: '2024-03-03', end: '2024-03-04', id: 'ae3852a18-e319-4336-b955-ba5bd72ec5eca' },
  { allDay: true, title: 'いいい', start: '2024-03-04', end: '2024-03-05', id: 'a5749f304-2309-431e-8b6a-a80808d4dddca' },
  { allDay: true, title: 'ううう', start: '2024-03-05', end: '2024-03-06', id: 'af95ec905-ed81-4bb9-be2c-50fe53fe7bb3a' },
  { allDay: true, title: 'ええええ', start: '2024-03-06', end: '2024-03-07', id: 'aabf2a4b7-f4ef-4b46-a408-4d9d37b094d2a' },
  { allDay: true, title: 'おおおお', start: '2024-03-13', end: '2024-03-14', id: 'a76086f12-69dd-4351-ab2e-cd37deb1c8a7a' },
]

const DELAY = 200
let simulateErrors = false

document.addEventListener('keypress', (ev) => {
  if (ev.key === 'e') {
    alert('You pressed the key "e". Will begin to simulate errors.')
    simulateErrors = true
  }
})

function excludeById(array, id) {
  return array.filter((item) => item.id !== id)
}

export function requestEventsInRange(startStr, endStr) {
  console.log(`[STUB] requesting events from ${startStr} to ${endStr}`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateErrors) {
        reject(new Error('error'))
      } else {
        resolve(eventDb) // won't use the start/end, always return whole DB
      }
    }, DELAY)
  })
}

export function requestEventCreate(event) {
  console.log('[STUB] requesting event create:', event)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateErrors) {
        reject(new Error('error'))
      } else {
        let newEventId = `a${v4()}a`
        let objWithId = { ...event, id: newEventId }
        eventDb.push(objWithId)
        resolve(newEventId)
      }
    }, DELAY)
  })
}

export function requestEventUpdate(event) {
  console.log('[STUB] requesting event update:', event)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateErrors) {
        reject(new Error('problem'))
      } else {
        eventDb = excludeById(eventDb, event.id)
        eventDb.push(event)
        resolve(eventDb)
      }
    }, DELAY)
  })
}

export function requestEventDelete(eventId) {
  console.log('[STUB] requesting event delete, id:', eventId)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simulate network delay
      if (simulateErrors) {
        reject(new Error('problem'))
      } else {
        eventDb = excludeById(eventDb, eventId)
        resolve(eventDb)
      }
    }, DELAY)
  })
}
