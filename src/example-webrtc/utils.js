// Override with your own STUN servers if you want
export const rtc_configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

// The default constraints that will be attempted. Can be overriden by the user.
export const default_constraints = { video: true, audio: true }

export const initialValue = {
  status: 'unknown',
  status_error: null,
  text: '',
  'peer-connect': '',
  'peer-connect-button': 'Connect',
  'remote-offerer': false,
  'peer-id': 'unknown',

  connect_attempts: 0,

  // keep track of some negotiation state to prevent races and errors
  callCreateTriggered: false,
  makingOffer: false,
  isSettingRemoteAnswerPending: false,
}

const ws_protocol = 'wss'
const ws_server = 'signalling.hexaforce.io'
const ws_port = null

// const ws_protocol = 'ws'
// const ws_server = window.location.hostname
// const ws_port = '8443'

export const websocketServerURL = () => {
  // let ws_protocol = use_ws_protocol || 'ws'
  // let ws_server
  // if (window.location.protocol.startsWith('file')) {
  //   ws_server = use_ws_server || '127.0.0.1'
  // } else if (window.location.protocol.startsWith('http')) {
  //   ws_server = use_ws_server || window.location.hostname
  // } else {
  //   throw new Error("Don't know how to connect to the signalling server with uri" + window.location)
  // }
  // let ws_port = use_ws_port || '8443'
  if (ws_port) return `${ws_protocol}://${ws_server}:${ws_port}`
  return `${ws_protocol}://${ws_server}`
}

const use_peer_id = null

export const generatePeerId = () => {
  return use_peer_id || Math.floor(Math.random() * (9000 - 10) + 10).toString()
}

export const trackStop = (stream) => {
  if (stream) {
    for (const track of stream.getTracks()) {
      track.stop()
    }
  }
}

const send = WebSocket.prototype.send
WebSocket.prototype.send = function (data) {
  if (typeof data === 'object' && data !== null) {
    console.log('send >>> : ', data)
    send.call(this, JSON.stringify(data))
  } else if (typeof data === 'string') {
    console.log(`send >>> : ${data}`)
    send.call(this, data)
  } else {
    console.error('Data is of unsupported type:', typeof data)
  }
}

export const parseMessage = (data) => {
  if (data.startsWith('ERROR')) {
    console.error(data)
    return null
  }
  try {
    const msg = JSON.parse(data)
    if (msg.sdp != null && msg.ice != null) {
      console.error('Unknown incoming JSON: ' + msg)
      return null
    }
    return { sdp: msg.sdp, ice: msg.ice }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err)
    } else {
      console.error(err)
    }
    return null
  }
}
